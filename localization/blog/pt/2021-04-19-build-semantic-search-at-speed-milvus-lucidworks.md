---
id: build-semantic-search-at-speed-milvus-lucidworks.md
title: Criar uma pesquisa semântica rápida
author: Elizabeth Edmiston
date: 2021-04-19T07:32:50.416Z
desc: >-
  Saiba mais sobre a utilização de metodologias de aprendizagem automática
  semântica para potenciar resultados de pesquisa mais relevantes em toda a sua
  organização.
cover: assets.zilliz.com/lucidworks_4753c98727.png
tag: Scenarios
canonicalUrl: 'https://zilliz.com/blog/build-semantic-search-at-speed-milvus-lucidworks'
---
<custom-h1>Crie uma pesquisa semântica rápida</custom-h1><p><a href="https://lucidworks.com/post/what-is-semantic-search/">A pesquisa semântica</a> é uma óptima ferramenta para ajudar os seus clientes, ou os seus funcionários, a encontrar os produtos ou as informações certas. Ela pode até mesmo trazer à tona informações difíceis de indexar para obter melhores resultados. Dito isto, se as suas metodologias semânticas não estiverem a ser implementadas para trabalhar rapidamente, não lhe servirão de nada. O cliente ou funcionário não vai ficar sentado enquanto o sistema demora a responder à sua consulta - e é provável que milhares de outras estejam a ser ingeridas ao mesmo tempo.</p>
<p>Como é que se pode tornar a pesquisa semântica rápida? A pesquisa semântica lenta não é suficiente.</p>
<p>Felizmente, este é o tipo de problema que a Lucidworks adora resolver. Recentemente, testamos um cluster de tamanho modesto - leia mais detalhes - que resultou em 1500 RPS (solicitações por segundo) em uma coleção de mais de um milhão de documentos, com um tempo médio de resposta de aproximadamente 40 milissegundos. Isto é que é velocidade a sério.</p>
<p><br/></p>
<h3 id="Implementing-Semantic-Search" class="common-anchor-header">Implementação da pesquisa semântica</h3><p>Para que a magia da aprendizagem automática seja extremamente rápida, a Lucidworks implementou a pesquisa semântica utilizando a abordagem de pesquisa vetorial semântica. Há duas partes essenciais.</p>
<p><br/></p>
<h4 id="Part-One-The-Machine-Learning-Model" class="common-anchor-header">Primeira parte: o modelo de aprendizado de máquina</h4><p>Primeiro, é necessária uma forma de codificar o texto num vetor numérico. O texto pode ser uma descrição de um produto, uma consulta de pesquisa do utilizador, uma pergunta ou mesmo uma resposta a uma pergunta. Um modelo de pesquisa semântica é treinado para codificar o texto de forma a que o texto que é semanticamente semelhante a outro texto seja codificado em vectores numericamente "próximos" uns dos outros. Este passo de codificação tem de ser rápido para suportar as milhares ou mais pesquisas possíveis de clientes ou consultas de utilizadores que chegam a cada segundo.</p>
<p><br/></p>
<h4 id="Part-Two-The-Vector-Search-Engine" class="common-anchor-header">Segunda parte: O motor de pesquisa de vectores</h4><p>Em segundo lugar, é necessária uma forma de encontrar rapidamente as melhores correspondências para a pesquisa do cliente ou consulta do utilizador. O modelo terá codificado esse texto num vetor numérico. A partir daí, é necessário compará-lo com todos os vectores numéricos do seu catálogo ou listas de perguntas e respostas para encontrar as melhores correspondências - os vectores que estão "mais próximos" do vetor de consulta. Para isso, é necessário um motor de vectores que possa tratar toda essa informação de forma eficaz e à velocidade da luz. O motor pode conter milhões de vectores e o utilizador apenas pretende as cerca de vinte melhores correspondências à sua consulta. E, claro, precisa de tratar cerca de mil dessas consultas por segundo.</p>
<p>Para enfrentar estes desafios, adicionámos o motor de pesquisa de vectores <a href="https://doc.lucidworks.com/fusion/5.3/8821/milvus">Milvus</a> na nossa <a href="https://lucidworks.com/post/enhance-personalization-efforts-with-new-features-in-fusion/">versão Fusion 5.3</a>. O Milvus é um software de código aberto e é rápido. O Milvus utiliza o FAISS<a href="https://ai.facebook.com/tools/faiss/">(Facebook AI Similarity Search</a>), a mesma tecnologia que o Facebook utiliza na produção para as suas próprias iniciativas de aprendizagem automática. Quando necessário, pode ser executado ainda mais rapidamente na <a href="https://en.wikipedia.org/wiki/Graphics_processing_unit">GPU</a>. Quando o Fusion 5.3 (ou superior) é instalado com o componente de aprendizagem automática, o Milvus é automaticamente instalado como parte desse componente para que possa ativar todas estas capacidades com facilidade.</p>
<p>O tamanho dos vectores de uma determinada coleção, especificado quando a coleção é criada, depende do modelo que produz esses vectores. Por exemplo, uma determinada coleção pode armazenar os vectores criados a partir da codificação (através de um modelo) de todas as descrições de produtos num catálogo de produtos. Sem um motor de pesquisa vetorial como o Milvus, as pesquisas por semelhança não seriam viáveis em todo o espaço vetorial. Assim, as pesquisas por semelhança teriam de ser limitadas a candidatos pré-selecionados do espaço vetorial (por exemplo, 500) e teriam um desempenho mais lento e resultados de menor qualidade. O Milvus pode armazenar centenas de milhares de milhões de vectores em várias colecções de vectores para garantir que a pesquisa é rápida e os resultados são relevantes.</p>
<p><br/></p>
<h3 id="Using-Semantic-Search" class="common-anchor-header">Utilizar a pesquisa semântica</h3><p>Voltemos ao fluxo de trabalho da pesquisa semântica, agora que aprendemos um pouco sobre o motivo pelo qual o Milvus pode ser tão importante. A pesquisa semântica tem três fases. Durante a primeira fase, o modelo de aprendizagem automática é carregado e/ou treinado. Depois, os dados são indexados no Milvus e no Solr. A fase final é a fase de consulta, quando ocorre a pesquisa propriamente dita. Iremos concentrar-nos nestas duas últimas fases abaixo.</p>
<p><br/></p>
<h3 id="Indexing-into-Milvus" class="common-anchor-header">Indexação no Milvus</h3><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Lucidworks_1_47a9221723.png" alt="Lucidworks-1.png" class="doc-image" id="lucidworks-1.png" />
   </span> <span class="img-wrapper"> <span>Lucidworks-1.png</span> </span></p>
<p>Como mostrado no diagrama acima, a etapa de consulta começa de forma semelhante à etapa de indexação, apenas com consultas chegando em vez de documentos. Para cada consulta:</p>
<ol>
<li>A consulta é enviada para o pipeline de indexação do <a href="https://lucidworks.com/products/smart-answers/">Smart Answers</a>.</li>
<li>A consulta é então enviada para o modelo de ML.</li>
<li>O modelo ML devolve um vetor numérico (encriptado a partir da consulta). Mais uma vez, o tipo de modelo determina o tamanho do vetor.</li>
<li>O vetor é enviado para o Milvus, que determina quais os vectores, na coleção Milvus especificada, que melhor correspondem ao vetor fornecido.</li>
<li>O Milvus devolve uma lista de IDs e distâncias únicas correspondentes aos vectores determinados no passo quatro.</li>
<li>Uma consulta contendo esses IDs e distâncias é enviada ao Solr.</li>
<li>O Solr devolve então uma lista ordenada dos documentos associados a esses IDs.</li>
</ol>
<p><br/></p>
<h3 id="Scale-Testing" class="common-anchor-header">Teste de escala</h3><p>Para provar que os nossos fluxos de pesquisa semântica estão a ser executados com a eficiência que exigimos para os nossos clientes, executámos testes de escala utilizando scripts Gatling na Google Cloud Platform, utilizando um cluster Fusion com oito réplicas do modelo ML, oito réplicas do serviço de consulta e uma única instância do Milvus. Os testes foram executados usando os índices FLAT e HNSW do Milvus. O índice FLAT tem 100% de recuperação, mas é menos eficiente - exceto quando os conjuntos de dados são pequenos. O índice HNSW (Hierarchical Small World Graph) continua a apresentar resultados de elevada qualidade e melhorou o desempenho em conjuntos de dados maiores.</p>
<p>Vamos ver alguns números de um exemplo recente que executámos:</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Lucidworks_2_3162113560.png" alt="Lucidworks-2.png" class="doc-image" id="lucidworks-2.png" />
   </span> <span class="img-wrapper"> <span>Lucidworks-2.png</span> </span></p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Lucidworks_3_3dc17f0ed8.png" alt="Lucidworks-3.png" class="doc-image" id="lucidworks-3.png" />
   </span> <span class="img-wrapper"> <span>Lucidworks-3.png</span> </span></p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Lucidworks_4_8a6edd2f59.png" alt="Lucidworks-4.png" class="doc-image" id="lucidworks-4.png" />
   </span> <span class="img-wrapper"> <span>Lucidworks-4.png</span> </span></p>
<p><br/></p>
<h3 id="Getting-Started" class="common-anchor-header">Como começar</h3><p>Os pipelines do <a href="https://lucidworks.com/products/smart-answers/">Smart Answers</a> são projetados para serem fáceis de usar. O Lucidworks possui <a href="https://doc.lucidworks.com/how-to/734/set-up-a-pre-trained-cold-start-model-for-smart-answers">modelos pré-treinados que são fáceis de implementar</a> e geralmente apresentam bons resultados - embora treinar seus próprios modelos, em conjunto com modelos pré-treinados, ofereça os melhores resultados. Contacte-nos hoje para saber como pode implementar estas iniciativas nas suas ferramentas de pesquisa para obter resultados mais eficazes e agradáveis.</p>
<blockquote>
<p>Este blogue foi republicado de: https://lucidworks.com/post/how-to-build-fast-semantic-search/?utm_campaign=Oktopost-Blog+Posts&amp;utm_medium=organic_social&amp;utm_source=linkedin</p>
</blockquote>
