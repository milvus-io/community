---
id: building-personalized-recommender-systems-milvus-paddlepaddle.md
title: Introdução
author: Shiyu Chen
date: 2021-02-24T23:12:34.209Z
desc: Como criar um sistema de recomendação com aprendizagem profunda
cover: assets.zilliz.com/header_e6c4a8aee6.jpg
tag: Scenarios
canonicalUrl: >-
  https://zilliz.com/blog/building-personalized-recommender-systems-milvus-paddlepaddle
---
<custom-h1>Criação de sistemas de recomendação personalizados com Milvus e PaddlePaddle</custom-h1><h2 id="Background-Introduction" class="common-anchor-header">Introdução<button data-href="#Background-Introduction" class="anchor-icon" translate="no">
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
    </button></h2><p>Com o desenvolvimento contínuo da tecnologia de rede e a escala cada vez maior do comércio eletrónico, o número e a variedade de produtos crescem rapidamente e os utilizadores precisam de gastar muito tempo para encontrar os produtos que querem comprar. Trata-se de uma sobrecarga de informação. Para resolver este problema, surgiu o sistema de recomendação.</p>
<p>O sistema de recomendação é um subconjunto do sistema de filtragem de informação, que pode ser utilizado numa série de áreas, tais como filmes, música, comércio eletrónico e recomendações de fluxos de alimentação. O sistema de recomendação descobre as necessidades e interesses personalizados do utilizador, analisando e explorando os comportamentos do utilizador, e recomenda informações ou produtos que possam ser do interesse do utilizador. Ao contrário dos motores de busca, os sistemas de recomendação não exigem que os utilizadores descrevam com precisão as suas necessidades, mas modelam o seu comportamento histórico para fornecer proactivamente informações que vão ao encontro dos interesses e necessidades do utilizador.</p>
<p>Neste artigo, utilizamos o PaddlePaddle, uma plataforma de aprendizagem profunda da Baidu, para construir um modelo e combinamos o Milvus, um motor de pesquisa de semelhança de vectores, para construir um sistema de recomendação personalizado que pode fornecer aos utilizadores informações interessantes de forma rápida e precisa.</p>
<h2 id="Data-Preparation" class="common-anchor-header">Preparação de dados<button data-href="#Data-Preparation" class="anchor-icon" translate="no">
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
    </button></h2><p>Tomamos o MovieLens Million Dataset (ml-1m) [1] como exemplo. O conjunto de dados ml-1m contém 1.000.000 de críticas de 4.000 filmes feitas por 6.000 utilizadores, recolhidas pelo laboratório de investigação GroupLens. Os dados originais incluem dados de caraterísticas do filme, caraterísticas do utilizador e classificação do filme pelo utilizador, pode consultar o ml-1m-README [2] .</p>
<p>O conjunto de dados ml-1m inclui 3 artigos .dat: movies.dat、users.dat e ratings.dat.movies.dat inclui as caraterísticas do filme, ver exemplo abaixo:</p>
<pre><code translate="no">MovieID::Title::Genres
1::ToyStory(1995)::Animation|Children's|Comedy
</code></pre>
<p>Isso significa que o id do filme é 1, e o título é 《Toy Story》, que é dividido em três categorias. Estas três categorias são animação, infantil e comédia.</p>
<p>O ficheiro users.dat inclui as caraterísticas do utilizador, ver exemplo abaixo:</p>
<pre><code translate="no">UserID::Gender::Age::Occupation::Zip-code
1::F::1::10::48067
</code></pre>
<p>Isto significa que o ID do utilizador é 1, do sexo feminino e com menos de 18 anos de idade. O ID da ocupação é 10.</p>
<p>ratings.dat inclui a caraterística de classificação do filme, ver exemplo abaixo:</p>
<p>UserID::MovieID::Rating::Timestamp 1::1193::5::978300760</p>
<p>Ou seja, o utilizador 1 avalia o filme 1193 com 5 pontos.</p>
<h2 id="Fusion-Recommendation-Model" class="common-anchor-header">Modelo de recomendação por fusão<button data-href="#Fusion-Recommendation-Model" class="anchor-icon" translate="no">
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
    </button></h2><p>No sistema de recomendação personalizada de filmes utilizámos o Modelo de Recomendação de Fusão [3] que a PaddlePaddle implementou. Este modelo foi criado a partir da sua prática industrial.</p>
<p>Primeiro, as caraterísticas do utilizador e as caraterísticas do filme são introduzidas na rede neural:</p>
<ul>
<li>As caraterísticas do utilizador incorporam quatro informações de atributos: ID do utilizador, sexo, profissão e idade.</li>
<li>As caraterísticas do filme incluem três atributos de informação: ID do filme, ID do tipo de filme e nome do filme.</li>
</ul>
<p>Para a caraterística do utilizador, mapear o ID do utilizador para uma representação vetorial com uma dimensão de 256, entrar na camada totalmente ligada e fazer um processamento semelhante para os outros três atributos. Em seguida, as representações das caraterísticas dos quatro atributos são totalmente ligadas e adicionadas separadamente.</p>
<p>Para as caraterísticas do filme, a identificação do filme é processada de forma semelhante à identificação do utilizador. A identificação do tipo de filme é introduzida diretamente na camada totalmente ligada sob a forma de um vetor, e o nome do filme é representado por um vetor de comprimento fixo utilizando uma rede neural convolucional de texto. As representações das caraterísticas dos três atributos são então totalmente ligadas e adicionadas separadamente.</p>
<p>Depois de obter a representação vetorial do utilizador e do filme, calcula-se a semelhança cosseno dos mesmos como a pontuação do sistema de recomendação personalizado. Finalmente, o quadrado da diferença entre a pontuação de semelhança e a pontuação real do utilizador é utilizado como a função de perda do modelo de regressão.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1_user_film_personalized_recommender_Milvus_9ec39f501d.jpg" alt="1-user-film-personalized-recommender-Milvus.jpg" class="doc-image" id="1-user-film-personalized-recommender-milvus.jpg" />
   </span> <span class="img-wrapper"> <span>1-user-film-personalized-recommender-Milvus.jpg</span> </span></p>
<h2 id="System-Overview" class="common-anchor-header">Visão geral do sistema<button data-href="#System-Overview" class="anchor-icon" translate="no">
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
    </button></h2><p>Combinado com o modelo de recomendação de fusão da PaddlePaddle, o vetor de caraterísticas do filme gerado pelo modelo é armazenado no motor de pesquisa de semelhanças de vectores Milvus e a caraterística do utilizador é utilizada como o vetor alvo a pesquisar. A pesquisa por semelhança é efectuada no Milvus para obter o resultado da consulta como os filmes recomendados para o utilizador.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/2_system_overview_5652afdca7.jpg" alt="2-system-overview.jpg" class="doc-image" id="2-system-overview.jpg" />
   </span> <span class="img-wrapper"> <span>2-system-overview.jpg</span> </span></p>
<blockquote>
<p>O método do produto interno (IP) é fornecido no Milvus para calcular a distância do vetor. Depois de normalizar os dados, a semelhança do produto interno é consistente com o resultado da semelhança de cosseno no modelo de recomendação de fusão.</p>
</blockquote>
<h2 id="Application-of-Personal-Recommender-System" class="common-anchor-header">Aplicação do sistema de recomendação pessoal<button data-href="#Application-of-Personal-Recommender-System" class="anchor-icon" translate="no">
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
    </button></h2><p>Existem três passos para construir um sistema de recomendação personalizado com Milvus, detalhes sobre como operar por favor consulte o Mivus Bootcamp [4].</p>
<h3 id="Step-1Model-Training" class="common-anchor-header">Passo 1：Treino do modelo</h3><pre><code translate="no"># run train.py
    $ python train.py
</code></pre>
<p>A execução deste comando irá gerar um modelo recommender_system.inference.model no diretório, que pode converter dados de filme e dados de usuário em vetores de recursos e gerar dados de aplicativo para Milvus armazenar e recuperar.</p>
<h3 id="Step-2Data-Preprocessing" class="common-anchor-header">Passo 2: Pré-processamento de dados</h3><pre><code translate="no"># Data preprocessing, -f followed by the parameter raw movie data file name
    $ python get_movies_data.py -f movies_origin.txt
</code></pre>
<p>A execução deste comando irá gerar dados de teste movies_data.txt no diretório para obter o pré-processamento dos dados do filme.</p>
<h3 id="Step-3Implementing-Personal-Recommender-System-with-Milvus" class="common-anchor-header">Passo 3：Implementação do sistema de recomendação pessoal com Milvus</h3><pre><code translate="no"># Implementing personal recommender system based on user conditions
    $ python infer_milvus.py -a &lt;age&gt;-g &lt;gender&gt;-j &lt;job&gt;[-i]
</code></pre>
<p>A execução deste comando irá implementar recomendações personalizadas para utilizadores especificados.</p>
<p>O processo principal é:</p>
<ul>
<li>Através do load_inference_model, os dados do filme são processados pelo modelo para gerar um vetor de caraterísticas do filme.</li>
<li>Carregar o vetor de caraterísticas do filme no Milvus através de milvus.insert.</li>
<li>De acordo com a idade / sexo / profissão do utilizador especificados pelos parâmetros, é convertido num vetor de caraterísticas do utilizador, milvus.search_vectors é utilizado para a recuperação de semelhanças e o resultado com a maior semelhança entre o utilizador e o filme é devolvido.</li>
</ul>
<p>Previsão dos cinco filmes principais em que o utilizador está interessado:</p>
<pre><code translate="no">TopIdsTitleScore
03030Yojimbo2.9444923996925354
13871Shane2.8583481907844543
23467Hud2.849525213241577
31809Hana-bi2.826111316680908
43184Montana2.8119677305221558 
</code></pre>
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
    </button></h2><p>Ao introduzir as informações do utilizador e as informações do filme no modelo de recomendação de fusão, podemos obter pontuações correspondentes e, em seguida, ordenar as pontuações de todos os filmes com base no utilizador para recomendar filmes que possam ser do interesse do utilizador. <strong>Este artigo combina o Milvus e o PaddlePaddle para criar um sistema de recomendação personalizado. O Milvus, um motor de pesquisa vetorial, é utilizado para armazenar todos os dados das caraterísticas dos filmes e, em seguida, é efectuada uma recuperação por semelhança das caraterísticas do utilizador no Milvus.</strong> O resultado da pesquisa é a classificação dos filmes recomendados pelo sistema ao utilizador.</p>
<p>O motor de pesquisa de semelhanças vectoriais Milvus [5] é compatível com várias plataformas de aprendizagem profunda, pesquisando milhares de milhões de vectores com uma resposta de apenas milissegundos. Pode explorar mais possibilidades de aplicações de IA com o Milvus com facilidade!</p>
<h2 id="Reference" class="common-anchor-header">Referência<button data-href="#Reference" class="anchor-icon" translate="no">
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
<li>MovieLens Million Dataset (ml-1m): http://files.grouplens.org/datasets/movielens/ml-1m.zip</li>
<li>ml-1m-README: http://files.grouplens.org/datasets/movielens/ml-1m-README.txt</li>
<li>Modelo de recomendação de fusão por PaddlePaddle: https://www.paddlepaddle.org.cn/documentation/docs/zh/beginners_guide/basics/recommender_system/index.html#id7</li>
<li>Bootcamp: https://github.com/milvus-io/bootcamp/tree/master/solutions/recommendation_system</li>
<li>Milvus: https://milvus.io/</li>
</ol>
