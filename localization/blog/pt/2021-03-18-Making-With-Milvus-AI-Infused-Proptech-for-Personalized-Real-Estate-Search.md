---
id: Making-With-Milvus-AI-Infused-Proptech-for-Personalized-Real-Estate-Search.md
title: >-
  Fazendo com a Milvus AI-Infused Proptech para pesquisa personalizada de
  imóveis
author: milvus
date: 2021-03-18T03:53:54.736Z
desc: >-
  A IA está a transformar o sector imobiliário, descubra como a proptech
  inteligente acelera o processo de procura e compra de casa.
cover: assets.zilliz.com/blog_realistate_search_da4e8ee01d.jpg
tag: Scenarios
canonicalUrl: >-
  https://zilliz.com/blog/Making-With-Milvus-AI-Infused-Proptech-for-Personalized-Real-Estate-Search
---
<custom-h1>Fazendo com Milvus: Proptech com infusão de IA para pesquisa personalizada de imóveis</custom-h1><p>A inteligência artificial (IA) tem <a href="https://medium.com/unstructured-data-service/the-easiest-way-to-search-among-1-billion-image-vectors-d6faf72e361f#d62b">aplicações poderosas</a> no sector imobiliário que estão a transformar o processo de pesquisa de casas. Os profissionais imobiliários experientes em tecnologia têm tirado proveito da IA há anos, reconhecendo sua capacidade de ajudar os clientes a encontrar a casa certa mais rapidamente e simplificar o processo de compra de imóveis. A pandemia de coronavírus <a href="https://www.pwc.com/ca/en/industries/real-estate/emerging-trends-in-real-estate-2021/shifting-landscape-proptech.html">acelerou</a> o interesse, a adoção e o investimento em tecnologia imobiliária (ou proptech) em todo o mundo, sugerindo que ela desempenhará um papel cada vez maior no setor imobiliário no futuro.</p>
<p>Este artigo explora a forma como <a href="https://bj.ke.com/">a Beike</a> utilizou a pesquisa por semelhança de vectores para criar uma plataforma de procura de casa que fornece resultados personalizados e recomenda listagens quase em tempo real.</p>
<h3 id="What-is-vector-similarity-search" class="common-anchor-header">O que é a pesquisa por semelhança de vectores?</h3><p><a href="https://medium.com/unstructured-data-service/vector-similarity-search-hides-in-plain-view-654f8152f8ab">A pesquisa por semelhança de</a> vectores tem aplicações que abrangem uma grande variedade de cenários de inteligência artificial, aprendizagem profunda e cálculo de vectores tradicionais. A proliferação da tecnologia de IA é em parte atribuída à pesquisa vetorial e à sua capacidade de dar sentido a dados não estruturados, que incluem coisas como imagens, vídeo, áudio, dados comportamentais, documentos e muito mais.</p>
<p>Os dados não estruturados constituem cerca de 80-90% de todos os dados e a extração de informações a partir dos mesmos está a tornar-se rapidamente um requisito para as empresas que pretendem manter-se competitivas num mundo em constante mudança. A procura crescente de análises de dados não estruturados, o aumento da capacidade de computação e a diminuição dos custos de computação tornaram a pesquisa vetorial com IA mais acessível do que nunca.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/beike_blog_img1_2dc95cac08.jpg" alt="beike-blog-img1.jpg" class="doc-image" id="beike-blog-img1.jpg" />
   </span> <span class="img-wrapper"> <span>beike-blog-img1.jpg</span> </span></p>
<p>Tradicionalmente, os dados não estruturados têm sido um desafio para processar e analisar em escala porque não seguem um modelo predefinido ou uma estrutura organizacional. As redes neuronais (por exemplo, CNN, RNN e BERT) permitem converter dados não estruturados em vectores de caraterísticas, um formato de dados numéricos que pode ser facilmente interpretado por computadores. Os algoritmos são depois utilizados para calcular a semelhança entre vectores utilizando métricas como a semelhança de cosseno ou a distância euclidiana.</p>
<p>Em última análise, a pesquisa de semelhança de vectores é um termo abrangente que descreve técnicas para identificar coisas semelhantes em conjuntos de dados maciços. A Beike utiliza esta tecnologia para alimentar um motor de pesquisa de casas inteligente que recomenda automaticamente listagens com base nas preferências individuais do utilizador, histórico de pesquisa e critérios de propriedade - acelerando o processo de pesquisa e compra de imóveis. A Milvus é uma base de dados vetorial de código aberto que liga a informação a algoritmos, permitindo à Beike desenvolver e gerir a sua plataforma imobiliária com IA.</p>
<p><br/></p>
<h3 id="How-does-Milvus-manage-vector-data" class="common-anchor-header">Como é que o Milvus gere os dados vectoriais?</h3><p>O Milvus foi criado especificamente para a gestão de dados vectoriais em grande escala e tem aplicações que abrangem a pesquisa de imagens e vídeos, a análise de semelhanças químicas, os sistemas de recomendação personalizados, a IA de conversação e muito mais. Os conjuntos de dados vectoriais armazenados no Milvus podem ser consultados de forma eficiente, com a maioria das implementações a seguir este processo geral:</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/beike_blog_img2_d5abb58f95.jpg" alt="beike-blog-img2.jpg" class="doc-image" id="beike-blog-img2.jpg" />
   </span> <span class="img-wrapper"> <span>beike-blog-img2.jpg</span> </span></p>
<p><br/></p>
<h3 id="How-does-Beike-use-Milvus-to-make-house-hunting-smarter" class="common-anchor-header">Como é que a Beike utiliza o Milvus para tornar a procura de casa mais inteligente?</h3><p>Descrita habitualmente como a resposta da China à Zillow, a Beike é uma plataforma online que permite aos agentes imobiliários listar propriedades para aluguer ou venda. Para ajudar a melhorar a experiência de pesquisa de casas para os caçadores de casas e para ajudar os agentes a fechar negócios mais rapidamente, a empresa criou um motor de pesquisa alimentado por IA para a sua base de dados de listagens. A base de dados de listagens de imóveis da Beike foi convertida em vectores de caraterísticas e depois introduzida no Milvus para indexação e armazenamento. O Milvus é então utilizado para realizar pesquisas por semelhança com base numa listagem de entrada, critérios de pesquisa, perfil de utilizador ou outros critérios.</p>
<p>Por exemplo, ao procurar mais casas semelhantes a um determinado anúncio, são extraídas caraterísticas como a planta, o tamanho, a orientação, os acabamentos interiores, as cores da pintura, entre outras. Uma vez que a base de dados original de listagens de propriedades foi <a href="https://medium.com/unstructured-data-service/how-to-choose-an-index-in-milvus-4f3d15259212">indexada</a>, as pesquisas podem ser efectuadas em meros milissegundos. O produto final de Beike teve um tempo médio de consulta de 113 milissegundos num conjunto de dados com mais de 3 milhões de vectores. No entanto, o Milvus é capaz de manter velocidades eficientes em conjuntos de dados à escala de um trilião, facilitando o trabalho desta base de dados imobiliária relativamente pequena. Em geral, o sistema segue o seguinte processo:</p>
<ol>
<li><p>Os modelos de aprendizagem profunda (por exemplo, CNN, RNN ou BERT) convertem dados não estruturados em vectores de caraterísticas, que são depois importados para o Milvus.</p></li>
<li><p>O Milvus armazena e indexa os vectores de caraterísticas.</p></li>
<li><p>O Milvus apresenta resultados de pesquisa de semelhanças com base nas consultas dos utilizadores.</p></li>
</ol>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/milvus_overview_diagram_d17cda0e47.png" alt="milvus-overview-diagram.png" class="doc-image" id="milvus-overview-diagram.png" />
   </span> <span class="img-wrapper"> <span>milvus-overview-diagram.png</span> </span></p>
<p><br/></p>
<p>A plataforma inteligente de pesquisa de imóveis da Beike é alimentada por um algoritmo de recomendação que calcula a semelhança de vectores utilizando a distância cosseno. O sistema encontra casas semelhantes com base em listagens de favoritos e critérios de pesquisa. Em termos gerais, funciona da seguinte forma:</p>
<ol>
<li><p>Com base numa listagem de entrada, caraterísticas como a planta, o tamanho e a orientação são utilizadas para extrair 4 colecções de vectores de caraterísticas.</p></li>
<li><p>As colecções de caraterísticas extraídas são utilizadas para efetuar uma pesquisa de semelhanças no Milvus. Os resultados da consulta para cada coleção de vectores são uma medida de semelhança entre o anúncio de entrada e outros anúncios semelhantes.</p></li>
<li><p>Os resultados da pesquisa de cada uma das 4 colecções de vectores são comparados e utilizados para recomendar casas semelhantes.</p></li>
</ol>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/beike_intelligent_house_platform_diagram_6e278da118.jpg" alt="beike-intelligent-house-platform-diagram.jpg" class="doc-image" id="beike-intelligent-house-platform-diagram.jpg" />
   </span> <span class="img-wrapper"> <span>beike-intelligent-house-platform-diagram.jpg</span> </span></p>
<p><br/></p>
<p>Como mostra a figura acima, o sistema implementa um mecanismo de comutação de tabelas A/B para atualizar os dados. O Milvus guarda os dados dos primeiros T dias na tabela A, no dia T+1 começa a guardar os dados na tabela B, no dia 2T+1 começa a reescrever a tabela A, e assim sucessivamente.</p>
<p><br/></p>
<h3 id="To-learn-more-about-making-things-with-Milvus-check-out-the-following-resources" class="common-anchor-header">Para saber mais sobre como criar coisas com o Milvus, consulte os seguintes recursos:</h3><ul>
<li><p><a href="https://zilliz.com/blog/Building-an-AI-Powered-Writing-Assistant-with-WPS-Office">Construindo um assistente de escrita com IA para o WPS Office</a></p></li>
<li><p><a href="https://zilliz.com/blog/Making-with-Milvus-AI-Powered-News-Recommendation-Inside-Xiaomi-Mobile-Browser">Fazer com o Milvus: Recomendação de notícias com IA no navegador móvel da Xiaomi</a></p></li>
</ul>
