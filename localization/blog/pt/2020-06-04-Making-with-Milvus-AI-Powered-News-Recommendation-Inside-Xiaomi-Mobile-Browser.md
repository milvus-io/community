---
id: >-
  Making-with-Milvus-AI-Powered-News-Recommendation-Inside-Xiaomi-Mobile-Browser.md
title: >-
  Fazer com a Milvus Recomendação de notícias com base em IA no navegador móvel
  da Xiaomi
author: milvus
date: 2020-06-04T02:30:34.750Z
desc: >-
  Descubra como a Xiaomi utilizou a IA e a Milvus para criar um sistema
  inteligente de recomendação de notícias capaz de encontrar o conteúdo mais
  relevante para os utilizadores do seu navegador Web móvel.
cover: assets.zilliz.com/blog_Sohu_News_dec53d0814.jpg
tag: Scenarios
canonicalUrl: >-
  https://zilliz.com/blog/Making-with-Milvus-AI-Powered-News-Recommendation-Inside-Xiaomi-Mobile-Browser
---
<custom-h1>Fazer com Milvus: Recomendação de notícias com IA no navegador móvel da Xiaomi</custom-h1><p>Desde os feeds das redes sociais às recomendações de listas de reprodução no Spotify, <a href="https://zilliz.com/blog/Vector-Similarity-Search-Hides-in-Plain-View">a inteligência artificial</a> já desempenha um papel importante nos conteúdos que vemos e com os quais interagimos todos os dias. Num esforço para diferenciar o seu navegador Web móvel, o fabricante multinacional de produtos electrónicos Xiaomi criou um motor de recomendação de notícias alimentado por IA. <a href="https://milvus.io/">A Milvus</a>, uma base de dados vetorial de código aberto criada especificamente para a pesquisa de semelhanças e a inteligência artificial, foi utilizada como a principal plataforma de gestão de dados da aplicação. Este artigo explica como a Xiaomi criou o seu motor de recomendação de notícias com IA e como o Milvus e outros algoritmos de IA foram utilizados.</p>
<p><br/></p>
<h3 id="Using-AI-to-suggest-personalized-content-and-cut-through-news-noise" class="common-anchor-header">Utilizar a IA para sugerir conteúdos personalizados e eliminar o ruído das notícias</h3><p>Com o New York Times a publicar mais de <a href="https://www.theatlantic.com/technology/archive/2016/05/how-many-stories-do-newspapers-publish-per-day/483845/">230 peças</a> de conteúdo por dia, o grande volume de artigos produzidos torna impossível para as pessoas obterem uma visão abrangente de todas as notícias. Para ajudar a filtrar grandes volumes de conteúdo e recomendar os artigos mais relevantes ou interessantes, recorremos cada vez mais à IA. Apesar de as recomendações estarem longe de ser perfeitas, a aprendizagem automática é cada vez mais necessária para ultrapassar o fluxo constante de novas informações que surgem do nosso mundo cada vez mais complexo e interligado.</p>
<p>A Xiaomi fabrica e investe em smartphones, aplicações móveis, computadores portáteis, electrodomésticos e muitos outros produtos. Num esforço para diferenciar um browser móvel que vem pré-instalado em muitos dos mais de 40 milhões de smartphones que a empresa vende todos os trimestres, a Xiaomi incorporou nele um sistema de recomendação de notícias. Quando os utilizadores iniciam o browser móvel da Xiaomi, a inteligência artificial é utilizada para recomendar conteúdos semelhantes com base no histórico de pesquisa do utilizador, nos seus interesses e muito mais. Milvus é uma base de dados de pesquisa de semelhança de vectores de código aberto utilizada para acelerar a recuperação de artigos relacionados.</p>
<p><br/></p>
<h3 id="How-does-AI-powered-content-recommendation-work" class="common-anchor-header">Como funciona a recomendação de conteúdos com base em IA?</h3><p>Na sua essência, a recomendação de notícias (ou qualquer outro tipo de sistema de recomendação de conteúdos) envolve a comparação de dados de entrada com uma base de dados maciça para encontrar informações semelhantes. Uma recomendação de conteúdo bem-sucedida envolve o equilíbrio entre relevância e atualidade e a incorporação eficiente de grandes volumes de novos dados, muitas vezes em tempo real.</p>
<p>Para acomodar conjuntos de dados maciços, os sistemas de recomendação são normalmente divididos em duas fases:</p>
<ol>
<li><strong>Recuperação</strong>: Durante a recuperação, o conteúdo é restringido a partir da biblioteca mais ampla com base nos interesses e no comportamento do utilizador. No browser móvel da Xiaomi, milhares de conteúdos são selecionados a partir de um conjunto de dados massivo que contém milhões de artigos de notícias.</li>
<li><strong>Ordenação</strong>: Em seguida, o conteúdo selecionado durante a recuperação é ordenado de acordo com determinados indicadores antes de ser enviado para o utilizador. À medida que os utilizadores se envolvem com o conteúdo recomendado, o sistema adapta-se em tempo real para fornecer sugestões mais relevantes.</li>
</ol>
<p>As recomendações de conteúdos noticiosos têm de ser feitas em tempo real com base no comportamento do utilizador e nos conteúdos publicados recentemente. Além disso, o conteúdo sugerido deve corresponder, tanto quanto possível, aos interesses do utilizador e à intenção de pesquisa.</p>
<p><br/></p>
<h3 id="Milvus-+-BERT--intelligent-content-suggestions" class="common-anchor-header">Milvus + BERT = sugestões inteligentes de conteúdos</h3><p>O Milvus é uma base de dados de pesquisa de semelhança de vectores de código aberto que pode ser integrada com modelos de aprendizagem profunda para alimentar aplicações que abrangem o processamento de linguagem natural, a verificação de identidade e muito mais. O Milvus indexa grandes conjuntos de dados vectoriais para tornar a pesquisa mais eficiente e suporta uma variedade de estruturas populares de IA para simplificar o processo de desenvolvimento de aplicações de aprendizagem automática. Estas caraterísticas tornam a plataforma ideal para armazenar e consultar dados vectoriais, um componente crítico de muitas aplicações de aprendizagem automática.</p>
<p>A Xiaomi selecionou o Milvus para gerir dados vectoriais para o seu sistema inteligente de recomendação de notícias porque é rápido, fiável e requer um mínimo de configuração e manutenção. No entanto, o Milvus tem de ser associado a um algoritmo de IA para criar aplicações implementáveis. A Xiaomi selecionou o BERT, abreviatura de Bidirectional Encoder Representation Transformers, como modelo de representação linguística no seu motor de recomendação. O BERT pode ser utilizado como um modelo geral de NLU (compreensão da linguagem natural) que pode conduzir a uma série de tarefas diferentes de NLP (processamento da linguagem natural). As suas principais caraterísticas incluem:</p>
<ul>
<li>O transformador do BERT é utilizado como estrutura principal do algoritmo e é capaz de captar relações explícitas e implícitas dentro e entre frases.</li>
<li>Objectivos de aprendizagem multi-tarefa, modelação de linguagem mascarada (MLM) e previsão da frase seguinte (NSP).</li>
<li>O BERT tem um melhor desempenho com maiores quantidades de dados e pode melhorar outras técnicas de processamento de linguagem natural, como o Word2Vec, actuando como uma matriz de conversão.</li>
</ul>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Blog_Xiaomi_1_6301344312.jpeg" alt="Blog_Xiaomi_1.jpeg" class="doc-image" id="blog_xiaomi_1.jpeg" />
   </span> <span class="img-wrapper"> <span>Blogue_Xiaomi_1.jpeg</span> </span></p>
<p><br/></p>
<p>A arquitetura de rede do BERT utiliza uma estrutura transformadora de várias camadas que abandona as redes neurais RNN e CNN tradicionais. Funciona convertendo a distância entre duas palavras em qualquer posição numa só, através do seu mecanismo de atenção, e resolve o problema da dependência que persiste na PNL há algum tempo.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Blog_Xiaomi_2_fe5cf2e401.jpeg" alt="Blog-Xiaomi-2.jpeg" class="doc-image" id="blog-xiaomi-2.jpeg" />
   </span> <span class="img-wrapper"> <span>Blogue-Xiaomi-2.jpeg</span> </span></p>
<p><br/></p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Blog_Xiaomi_3_5d10b51440.jpeg" alt="Blog-Xiaomi-3.jpeg" class="doc-image" id="blog-xiaomi-3.jpeg" />
   </span> <span class="img-wrapper"> <span>Blogue-Xiaomi-3.jpeg</span> </span></p>
<p><br/></p>
<p>O BERT fornece um modelo simples e um modelo complexo. Os hiperparâmetros correspondentes são os seguintes: BERT BASE: L = 12, H = 768, A = 12, parâmetro total 110M; BERT LARGE: L = 24, H = 1024, A = 16, o número total de parâmetros é 340M.</p>
<p>Nos hiperparâmetros acima, L representa o número de camadas na rede (ou seja, o número de blocos de transformador), A representa o número de auto-atenção em Multi-Head Attention e o tamanho do filtro é 4H.</p>
<p><br/></p>
<h3 id="Xiaomi’s-content-recommendation-system" class="common-anchor-header">Sistema de recomendação de conteúdos da Xiaomi</h3><p>O sistema de recomendação de notícias baseado no browser da Xiaomi assenta em três componentes principais: vectorização, mapeamento de ID e serviço de vizinho mais próximo aproximado (ANN).</p>
<p>A vectorização é um processo em que os títulos dos artigos são convertidos em vectores de frases gerais. O modelo SimBert, baseado no BERT, é utilizado no sistema de recomendação da Xiaomi. O SimBert é um modelo de 12 camadas com um tamanho oculto de 768. O Simbert utiliza o modelo de treino chinês L-12_H-768_A-12 para treino contínuo (sendo a tarefa de treino "aprendizagem métrica +UniLM", e treinou 1,17 milhões de passos num signle TITAN RTX com o optimizador Adam (taxa de aprendizagem 2e-6, tamanho do lote 128). Simplificando, este é um modelo BERT optimizado.</p>
<p>Os algoritmos ANN comparam os títulos dos artigos vectorizados com toda a biblioteca de notícias armazenada no Milvus e, em seguida, devolvem conteúdos semelhantes aos utilizadores. O mapeamento de ID é utilizado para obter informações relevantes, como visualizações de páginas e cliques nos artigos correspondentes.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Blog_Xiaomi_N1_f4749b3131.jpeg" alt="Blog-Xiaomi-N1.jpeg" class="doc-image" id="blog-xiaomi-n1.jpeg" />
   </span> <span class="img-wrapper"> <span>Blogue-Xiaomi-N1.jpeg</span> </span></p>
<p><br/></p>
<p>Os dados armazenados no Milvus que alimentam o motor de recomendação de notícias da Xiaomi estão constantemente a ser actualizados, incluindo artigos adicionais e informações de atividade. À medida que o sistema incorpora novos dados, os dados antigos têm de ser eliminados. Neste sistema, as actualizações completas dos dados são feitas nos primeiros T-1 dias e as actualizações incrementais são feitas nos T dias seguintes.</p>
<p>Em intervalos definidos, os dados antigos são eliminados e os dados processados dos T-1 dias são inseridos na coleção. Aqui, os dados recentemente gerados são incorporados em tempo real. Uma vez inseridos os novos dados, é efectuada uma pesquisa de semelhanças no Milvus. Os artigos recuperados são novamente ordenados por taxa de cliques e outros factores, e o conteúdo de topo é mostrado aos utilizadores. Num cenário como este, em que os dados são frequentemente actualizados e os resultados têm de ser apresentados em tempo real, a capacidade do Milvus para incorporar e pesquisar rapidamente novos dados permite acelerar drasticamente a recomendação de conteúdos noticiosos no browser móvel da Xiaomi.</p>
<p><br/></p>
<h3 id="Milvus-makes-vector-similarity-search-better" class="common-anchor-header">Milvus melhora a pesquisa por semelhança de vectores</h3><p>A vectorização de dados e o cálculo da semelhança entre vectores é a tecnologia de recuperação mais utilizada. O surgimento de motores de pesquisa de semelhança de vectores baseados em RNA melhorou consideravelmente a eficiência dos cálculos de semelhança de vectores. Em comparação com soluções semelhantes, o Milvus oferece armazenamento de dados optimizado, SDKs abundantes e uma versão distribuída que reduz significativamente a carga de trabalho da construção de uma camada de recuperação. Além disso, a comunidade de código aberto ativa do Milvus é um recurso poderoso que pode ajudar a responder a perguntas e a resolver problemas à medida que estes surgem.</p>
<p>Se quiser saber mais sobre a pesquisa por similaridade de vetores e o Milvus, confira os seguintes recursos:</p>
<ul>
<li>Confira <a href="https://github.com/milvus-io/milvus">o Milvus</a> no Github.</li>
<li><a href="https://zilliz.com/blog/Vector-Similarity-Search-Hides-in-Plain-View">A pesquisa de similaridade vetorial se esconde à vista de todos</a></li>
<li><a href="https://zilliz.com/blog/Accelerating-Similarity-Search-on-Really-Big-Data-with-Vector-Indexing">Acelerando a pesquisa de similaridade em dados realmente grandes com indexação vetorial</a></li>
</ul>
<p>Leia outras <a href="https://zilliz.com/user-stories">histórias de utilizadores</a> para saber mais sobre como fazer coisas com o Milvus.</p>
