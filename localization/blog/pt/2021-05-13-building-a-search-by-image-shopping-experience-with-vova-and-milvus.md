---
id: building-a-search-by-image-shopping-experience-with-vova-and-milvus.md
title: Criar uma experiência de compras de pesquisa por imagem com VOVA e Milvus
author: milvus
date: 2021-05-13T08:44:05.528Z
desc: >-
  Descubra como a Milvus, uma base de dados vetorial de código aberto, foi
  utilizada pela plataforma de comércio eletrónico VOVA para permitir compras
  por imagem.
cover: assets.zilliz.com/vova_thumbnail_db2d6c0c9c.jpg
tag: Scenarios
canonicalUrl: >-
  https://zilliz.com/blog/building-a-search-by-image-shopping-experience-with-vova-and-milvus
---
<custom-h1>Construindo uma experiência de pesquisa por imagem com VOVA e Milvus</custom-h1><p>Saltar para:</p>
<ul>
<li><a href="#building-a-search-by-image-shopping-experience-with-vova-and-milvus">Construir uma experiência de compra por imagem com VOVA e Milvus</a><ul>
<li><a href="#how-does-image-search-work">Como funciona a pesquisa</a> <a href="#system-process-of-vovas-search-by-image-functionality"><em>por imagem</em></a> - <a href="#system-process-of-vovas-search-by-image-functionality"><em>Processo de sistema da funcionalidade de pesquisa por imagem da VOVA.</em></a></li>
<li><a href="#target-detection-using-the-yolo-model">Deteção de alvos usando o modelo YOLO</a>- <a href="#yolo-network-architecture"><em>Arquitetura da rede YOLO.</em></a></li>
<li><a href="#image-feature-vector-extraction-with-resnet">Extração de vectores de caraterísticas de imagem com a ResNet</a>- <a href="#resnet-structure"><em>Estrutura da ResNet.</em></a></li>
<li><a href="#vector-similarity-search-powered-by-milvus">Pesquisa por semelhança de vectores com Milvus</a>- <a href="#mishards-architecture-in-milvus"><em>Arquitetura de Mishards em Milvus.</em></a></li>
<li><a href="#vovas-shop-by-image-tool">Ferramenta de compra por imagem da VOVA</a>- <a href="#screenshots-of-vovas-search-by-image-shopping-tool"><em>Capturas de ecrã da ferramenta de compra por imagem da VOVA.</em></a></li>
<li><a href="#reference">Referência</a></li>
</ul></li>
</ul>
<p>As compras em linha aumentaram em 2020, com <a href="https://www.digitalcommerce360.com/2021/02/15/ecommerce-during-coronavirus-pandemic-in-charts/">um crescimento de 44%</a>, em grande parte devido à pandemia do coronavírus. À medida que as pessoas procuravam distanciar-se socialmente e evitar o contacto com estranhos, a entrega sem contacto tornou-se uma opção incrivelmente desejável para muitos consumidores. Esta popularidade levou também a que as pessoas comprassem uma maior variedade de produtos em linha, incluindo artigos de nicho que podem ser difíceis de descrever utilizando uma pesquisa tradicional por palavra-chave.</p>
<p>Para ajudar os utilizadores a ultrapassar as limitações das consultas baseadas em palavras-chave, as empresas podem criar motores de pesquisa de imagens que permitam aos utilizadores utilizar imagens em vez de palavras para a pesquisa. Isto não só permite aos utilizadores encontrar artigos difíceis de descrever, como também os ajuda a comprar coisas que encontram na vida real. Esta funcionalidade ajuda a criar uma experiência de utilizador única e oferece uma conveniência geral que os clientes apreciam.</p>
<p>A VOVA é uma plataforma de comércio eletrónico emergente que se centra na acessibilidade e na oferta de uma experiência de compra positiva aos seus utilizadores, com listagens que abrangem milhões de produtos e suporte para 20 línguas e 35 moedas principais. Para melhorar a experiência de compra dos seus utilizadores, a empresa utilizou a Milvus para integrar a funcionalidade de pesquisa de imagens na sua plataforma de comércio eletrónico. O artigo explora a forma como a VOVA construiu com sucesso um motor de pesquisa de imagens com Milvus.</p>
<p><br/></p>
<h3 id="How-does-image-search-work" class="common-anchor-header">Como é que a pesquisa de imagens funciona?</h3><p>O sistema de loja por imagem da VOVA procura no inventário da empresa imagens de produtos semelhantes às carregadas pelos utilizadores. O gráfico seguinte mostra as duas fases do processo do sistema, a fase de importação de dados (azul) e a fase de consulta (laranja):</p>
<ol>
<li>Utilizar o modelo YOLO para detetar alvos a partir de fotografias carregadas;</li>
<li>Utilizar o ResNet para extrair vectores de caraterísticas dos alvos detectados;</li>
<li>Utilizar o Milvus para a pesquisa de semelhanças entre vectores.</li>
</ol>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Vova_1_47ee6f2da9.png" alt="Vova-1.png" class="doc-image" id="vova-1.png" />
   </span> <span class="img-wrapper"> <span>Vova-1.png</span> </span></p>
<p><br/></p>
<h3 id="Target-detection-using-the-YOLO-model" class="common-anchor-header">Deteção de alvos usando o modelo YOLO</h3><p>As aplicações móveis da VOVA para Android e iOS suportam atualmente a pesquisa de imagens. A empresa utiliza um sistema de deteção de objectos em tempo real de última geração chamado YOLO (You only look once) para detetar objectos em imagens carregadas pelos utilizadores. O modelo YOLO está atualmente na sua quinta iteração.</p>
<p>O YOLO é um modelo de uma fase, que utiliza apenas uma rede neural convolucional (CNN) para prever categorias e posições de diferentes alvos. É pequeno, compacto e adequado para utilização móvel.</p>
<p>O YOLO utiliza camadas convolucionais para extrair caraterísticas e camadas totalmente ligadas para obter valores previstos. Inspirando-se no modelo GooLeNet, a CNN do YOLO inclui 24 camadas convolucionais e duas camadas totalmente conectadas.</p>
<p>Como mostra a ilustração seguinte, uma imagem de entrada de 448 × 448 é convertida por várias camadas convolucionais e camadas de agrupamento num tensor de 7 × 7 × 1024 dimensões (representado no penúltimo cubo abaixo) e, em seguida, convertida por duas camadas totalmente ligadas num tensor de saída de 7 × 7 × 30 dimensões.</p>
<p>A saída prevista do YOLO P é um tensor bidimensional, cuja forma é [batch,7 ×7 ×30]. Usando o fatiamento, P[:,0:7×7×20] é a probabilidade da categoria, P[:,7×7×20:7×7×(20+2)] é a confiança, e P[:,7×7×(20+2)]:] é o resultado previsto da caixa delimitadora.</p>
<p>![vova-2.png](https://assets.zilliz.com/vova_2_1ccf38f721.png &quot;Arquitetura da rede YOLO.)</p>
<p><br/></p>
<h3 id="Image-feature-vector-extraction-with-ResNet" class="common-anchor-header">Extração do vetor de caraterísticas da imagem com ResNet</h3><p>A VOVA adoptou o modelo de rede neural residual (ResNet) para extrair vectores de caraterísticas de uma extensa biblioteca de imagens de produtos e de fotografias carregadas pelos utilizadores. A ResNet é limitada porque à medida que a profundidade de uma rede de aprendizagem aumenta, a precisão da rede diminui. A imagem abaixo mostra a ResNet a executar o modelo VGG19 (uma variante do modelo VGG) modificado para incluir uma unidade residual através do mecanismo de curto-circuito. O VGG foi proposto em 2014 e inclui apenas 14 camadas, enquanto a ResNet foi lançada um ano depois e pode ter até 152.</p>
<p>A estrutura ResNet é fácil de modificar e escalar. Ao alterar o número de canais no bloco e o número de blocos empilhados, a largura e a profundidade da rede podem ser facilmente ajustadas para obter redes com diferentes capacidades expressivas. Isto resolve eficazmente o efeito de degeneração da rede, em que a precisão diminui à medida que a profundidade da aprendizagem aumenta. Com dados de treino suficientes, é possível obter um modelo com um melhor desempenho expressivo, aprofundando gradualmente a rede. Através do treino do modelo, são extraídas caraterísticas para cada imagem e convertidas em vectores de vírgula flutuante de 256 dimensões.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/vova_3_df4b810281.png" alt="vova-3.png" class="doc-image" id="vova-3.png" />
   </span> <span class="img-wrapper"> <span>vova-3.png</span> </span></p>
<p><br/></p>
<h3 id="Vector-similarity-search-powered-by-Milvus" class="common-anchor-header">Pesquisa de semelhança de vectores com tecnologia Milvus</h3><p>A base de dados de imagens de produtos da VOVA inclui 30 milhões de imagens e está a crescer rapidamente. Para recuperar rapidamente as imagens de produtos mais semelhantes a partir deste enorme conjunto de dados, o Milvus é utilizado para efetuar a pesquisa de semelhanças vectoriais. Graças a uma série de optimizações, o Milvus oferece uma abordagem rápida e simplificada para gerir dados vectoriais e criar aplicações de aprendizagem automática. O Milvus oferece integração com bibliotecas de índices populares (por exemplo, Faiss, Annoy), suporta vários tipos de índices e métricas de distância, tem SDKs em vários idiomas e fornece APIs ricas para gerir dados vectoriais.</p>
<p>O Milvus pode efetuar pesquisas de similaridade em conjuntos de dados de triliões de vectores em milissegundos, com um tempo de consulta inferior a 1,5 segundos quando nq=1 e um tempo médio de consulta em lote inferior a 0,08 segundos. Para construir o seu motor de pesquisa de imagens, a VOVA referiu-se ao design do Mishards, a solução de middleware de fragmentação da Milvus (ver o gráfico abaixo para o design do sistema), para implementar um cluster de servidores altamente disponível. Ao tirar partido da escalabilidade horizontal de um cluster Milvus, o requisito do projeto para um elevado desempenho de consulta em conjuntos de dados maciços foi cumprido.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/vova_4_e305f1955c.png" alt="vova-4.png" class="doc-image" id="vova-4.png" />
   </span> <span class="img-wrapper"> <span>vova-4.png</span> </span></p>
<h3 id="VOVAs-shop-by-image-tool" class="common-anchor-header">Ferramenta de compra por imagem do VOVA</h3><p>As capturas de ecrã abaixo mostram a ferramenta de pesquisa por imagem da VOVA na aplicação Android da empresa.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/vova_5_c4c25a3bae.png" alt="vova-5.png" class="doc-image" id="vova-5.png" />
   </span> <span class="img-wrapper"> <span>vova-5.png</span> </span></p>
<p>À medida que mais utilizadores pesquisam produtos e carregam fotografias, a VOVA continuará a otimizar os modelos que alimentam o sistema. Além disso, a empresa irá incorporar novas funcionalidades Milvus que podem melhorar ainda mais a experiência de compra online dos seus utilizadores.</p>
<h3 id="Reference" class="common-anchor-header">Referência</h3><p><strong>YOLO:</strong></p>
<p>https://arxiv.org/pdf/1506.02640.pdf</p>
<p>https://arxiv.org/pdf/1612.08242.pdf</p>
<p><strong>ResNet:</strong></p>
<p>https://arxiv.org/abs/1512.03385</p>
<p><strong>Milvus:</strong></p>
<p>https://milvus.io/docs</p>
