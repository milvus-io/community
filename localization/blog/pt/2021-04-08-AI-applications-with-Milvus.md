---
id: AI-applications-with-Milvus.md
title: Como criar 4 aplicações populares de IA com o Milvus
author: milvus
date: 2021-04-08T04:14:03.700Z
desc: >-
  O Milvus acelera o desenvolvimento de aplicações de aprendizagem automática e
  as operações de aprendizagem automática (MLOps). Com Milvus, pode desenvolver
  rapidamente um produto mínimo viável (MVP), mantendo os custos em limites mais
  baixos.
cover: assets.zilliz.com/blog_cover_4a9807b9e0.png
tag: Scenarios
canonicalUrl: 'https://zilliz.com/blog/AI-applications-with-Milvus'
---
<custom-h1>Como criar 4 aplicações de IA populares com o Milvus</custom-h1><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/blog_cover_4a9807b9e0.png" alt="blog cover.png" class="doc-image" id="blog-cover.png" />
   </span> <span class="img-wrapper"> <span>capa do blogue.png</span> </span></p>
<p><a href="https://milvus.io/">O Milvus</a> é uma base de dados vetorial de código aberto. Suporta a adição, eliminação, atualização e pesquisa quase em tempo real de conjuntos de dados vectoriais maciços criados através da extração de vectores de caraterísticas de dados não estruturados utilizando modelos de IA. Com um conjunto abrangente de APIs intuitivas e suporte para várias bibliotecas de índices amplamente adoptadas (por exemplo, Faiss, NMSLIB e Annoy), o Milvus acelera o desenvolvimento de aplicações de aprendizagem automática e operações de aprendizagem automática (MLOps). Com o Milvus, é possível desenvolver rapidamente um produto mínimo viável (MVP), mantendo os custos em limites mais baixos.</p>
<p>&quot;Que recursos estão disponíveis para desenvolver uma aplicação de IA com Milvus?&quot; é uma pergunta frequente na comunidade Milvus. A Zilliz, a <a href="https://zilliz.com/">empresa</a> por detrás do Milvus, desenvolveu uma série de demonstrações que utilizam o Milvus para efetuar pesquisas de semelhanças extremamente rápidas que alimentam aplicações inteligentes. O código-fonte das soluções Milvus pode ser encontrado em <a href="https://github.com/zilliz-bootcamp">zilliz-bootcamp</a>. Os seguintes cenários interactivos demonstram o processamento de linguagem natural (PNL), a pesquisa inversa de imagens, a pesquisa de áudio e a visão por computador.</p>
<p>Não hesite em experimentar as soluções para ganhar alguma experiência prática com cenários específicos! Partilhe os seus próprios cenários de aplicação através do:</p>
<ul>
<li><a href="https://join.slack.com/t/milvusio/shared_invite/zt-e0u4qu3k-bI2GDNys3ZqX1YCJ9OM~GQ">Slack</a></li>
<li><a href="https://github.com/milvus-io/milvus/discussions">GitHub</a></li>
</ul>
<p><br/></p>
<p><strong>Saltar para:</strong></p>
<ul>
<li><a href="#natural-language-processing-chatbots">Processamento de linguagem natural (chatbots)</a></li>
<li><a href="#reverse-image-search-systems">Pesquisa inversa de imagens</a></li>
<li><a href="#audio-search-systems">Pesquisa de áudio</a></li>
<li><a href="#video-object-detection-computer-vision">Deteção de objectos de vídeo (visão por computador)</a></li>
</ul>
<p><br/></p>
<h3 id="Natural-language-processing-chatbots" class="common-anchor-header">Processamento de linguagem natural (chatbots)</h3><p>O Milvus pode ser utilizado para criar chatbots que utilizam o processamento de linguagem natural para simular um operador em direto, responder a perguntas, encaminhar os utilizadores para informações relevantes e reduzir os custos de mão de obra. Para demonstrar este cenário de aplicação, a Zilliz criou um chatbot alimentado por IA que compreende linguagem semântica, combinando o Milvus com o <a href="https://en.wikipedia.org/wiki/BERT_(language_model)">BERT</a>, um modelo de aprendizagem automática (ML) desenvolvido para pré-treino de PNL.</p>
<p><a href="https://github.com/zilliz-bootcamp/intelligent_question_answering_v2">Código-fonte：zilliz-bootcamp/intelligent_question_answering_v2</a></p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1_c301a9e4bd.png" alt="1.png" class="doc-image" id="1.png" />
   </span> <span class="img-wrapper"> <span>1.png</span> </span></p>
<h4 id="How-to-use" class="common-anchor-header">Como utilizar</h4><ol>
<li><p>Carregue um conjunto de dados que inclua pares de perguntas e respostas. Formate as perguntas e respostas em duas colunas separadas. Em alternativa, está disponível para transferência um <a href="https://zilliz.com/solutions/qa">conjunto de dados de amostra</a>.</p></li>
<li><p>Depois de digitar a sua pergunta, uma lista de perguntas semelhantes será recuperada do conjunto de dados carregado.</p></li>
<li><p>Revele a resposta selecionando a pergunta mais semelhante à sua.</p></li>
</ol>
<p>👉Vídeo<a href="https://www.youtube.com/watch?v=ANgoyvgAxgU">：[Demonstração] Sistema de controlo de qualidade desenvolvido pela Milvus</a></p>
<h4 id="How-it-works" class="common-anchor-header">Como é que funciona</h4><p>As perguntas são convertidas em vectores de caraterísticas utilizando o modelo BERT da Google e, em seguida, o Milvus é utilizado para gerir e consultar o conjunto de dados.</p>
<p><strong>Processamento de dados:</strong></p>
<ol>
<li>O BERT é utilizado para converter os pares de perguntas e respostas carregados em vectores de caraterísticas de 768 dimensões. Os vectores são depois importados para o Milvus e são-lhes atribuídos IDs individuais.</li>
<li>Os IDs dos vectores de perguntas e respostas correspondentes são armazenados no PostgreSQL.</li>
</ol>
<p><strong>Pesquisa de perguntas semelhantes:</strong></p>
<ol>
<li>O BERT é utilizado para extrair vectores de caraterísticas da pergunta introduzida por um utilizador.</li>
<li>O Milvus recupera IDs de vectores para perguntas que são mais semelhantes à pergunta de entrada.</li>
<li>O sistema procura as respostas correspondentes no PostgreSQL.</li>
</ol>
<p><br/></p>
<h3 id="Reverse-image-search-systems" class="common-anchor-header">Sistemas de pesquisa inversa de imagens</h3><p>A pesquisa inversa de imagens está a transformar o comércio eletrónico através de recomendações personalizadas de produtos e ferramentas de pesquisa de produtos semelhantes que podem aumentar as vendas. Neste cenário de aplicação, Zilliz criou um sistema de pesquisa inversa de imagens combinando o Milvus com o <a href="https://towardsdatascience.com/how-to-use-a-pre-trained-model-vgg-for-image-classification-8dd7c4a4a517">VGG</a>, um modelo de ML que pode extrair caraterísticas de imagens.</p>
<p><a href="https://github.com/zilliz-bootcamp/image_search">Código-fonte：zilliz-bootcamp/image_search</a></p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/2_09000e2e2e.jpeg" alt="2.jpeg" class="doc-image" id="2.jpeg" />
   </span> <span class="img-wrapper"> <span>2.jpeg</span> </span></p>
<h4 id="How-to-use" class="common-anchor-header">Como utilizar</h4><ol>
<li>Carregue um conjunto de dados de imagem zipado composto apenas por imagens .jpg (não são aceites outros tipos de ficheiros de imagem). Em alternativa, está disponível para transferência um <a href="https://zilliz.com/solutions/image-search">conjunto de dados de amostra</a>.</li>
<li>Carregue uma imagem para utilizar como entrada de pesquisa para encontrar imagens semelhantes.</li>
</ol>
<p>👉Vídeo: <a href="https://www.youtube.com/watch?v=mTO8YdQObKY">[Demonstração] Pesquisa de imagens com o Milvus</a></p>
<h4 id="How-it-works" class="common-anchor-header">Como funciona</h4><p>As imagens são convertidas em vectores de caraterísticas de 512 dimensões utilizando o modelo VGG e, em seguida, o Milvus é utilizado para gerir e consultar o conjunto de dados.</p>
<p><strong>Processamento de dados:</strong></p>
<ol>
<li>O modelo VGG é utilizado para converter o conjunto de dados de imagens carregado em vectores de caraterísticas. Os vectores são depois importados para o Milvus e são-lhes atribuídos IDs individuais.</li>
<li>Os vectores de caraterísticas das imagens e os caminhos dos ficheiros de imagem correspondentes são armazenados na CacheDB.</li>
</ol>
<p><strong>Pesquisa de imagens semelhantes:</strong></p>
<ol>
<li>O VGG é utilizado para converter a imagem carregada por um utilizador em vectores de caraterísticas.</li>
<li>Os IDs dos vectores das imagens mais semelhantes à imagem de entrada são obtidos a partir do Milvus.</li>
<li>O sistema procura os caminhos dos ficheiros de imagem correspondentes na CacheDB.</li>
</ol>
<p><br/></p>
<h3 id="Audio-search-systems" class="common-anchor-header">Sistemas de pesquisa de áudio</h3><p>A pesquisa de fala, música, efeitos sonoros e outros tipos de áudio permite consultar rapidamente grandes volumes de dados de áudio e obter sons semelhantes. As aplicações incluem a identificação de efeitos sonoros semelhantes, minimizando a infração de IP e muito mais. Para demonstrar este cenário de aplicação, Zilliz criou um sistema de pesquisa de semelhança de áudio altamente eficiente, combinando Milvus com <a href="https://arxiv.org/abs/1912.10211">PANNs - uma</a>rede neural de áudio pré-treinada em grande escala criada para reconhecimento de padrões de áudio.</p>
<p>Código <a href="https://github.com/zilliz-bootcamp/audio_search">fonte：zilliz-bootcamp/audio_search</a> <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/3_419bac3dd2.png" alt="3.png" class="doc-image" id="3.png" /><span>3.png</span> </span></p>
<h4 id="How-to-use" class="common-anchor-header">Como utilizar</h4><ol>
<li>Carregue um conjunto de dados de áudio zipado composto apenas por ficheiros .wav (não são aceites outros tipos de ficheiros de áudio). Em alternativa, está disponível para transferência um <a href="https://zilliz.com/solutions/audio-search">conjunto de dados de amostra</a>.</li>
<li>Carregue um ficheiro .wav para utilizar como entrada de pesquisa para encontrar áudio semelhante.</li>
</ol>
<p>👉Vídeo: <a href="https://www.youtube.com/watch?v=0eQHeqriCXw">[Demonstração] Pesquisa de áudio com o Milvus</a></p>
<h4 id="How-it-works" class="common-anchor-header">Como funciona</h4><p>O áudio é convertido em vectores de caraterísticas utilizando PANNs, redes neurais de áudio pré-treinadas em grande escala criadas para o reconhecimento de padrões de áudio. Em seguida, o Milvus é utilizado para gerir e consultar o conjunto de dados.</p>
<p><strong>Processamento de dados:</strong></p>
<ol>
<li>As PANNs convertem o áudio do conjunto de dados carregado em vectores de caraterísticas. Os vectores são depois importados para o Milvus e são-lhes atribuídos IDs individuais.</li>
<li>Os IDs dos vectores de caraterísticas de áudio e os caminhos dos ficheiros .wav correspondentes são armazenados no PostgreSQL.</li>
</ol>
<p><strong>Pesquisa de áudio semelhante:</strong></p>
<ol>
<li>O PANNs é utilizado para converter o ficheiro de áudio carregado por um utilizador em vectores de caraterísticas.</li>
<li>Os ID dos vectores de áudio mais semelhantes ao ficheiro carregado são recuperados do Milvus através do cálculo da distância do produto interno (IP).</li>
<li>O sistema procura os caminhos dos ficheiros de áudio correspondentes no MySQL.</li>
</ol>
<p><br/></p>
<h3 id="Video-object-detection-computer-vision" class="common-anchor-header">Deteção de objectos de vídeo (visão por computador)</h3><p>A deteção de objectos de vídeo tem aplicações em visão por computador, recuperação de imagens, condução autónoma, etc. Para demonstrar este cenário de aplicação, Zilliz criou um sistema de deteção de objectos vídeo combinando o Milvus com tecnologias e algoritmos como o <a href="https://en.wikipedia.org/wiki/OpenCV">OpenCV</a>, o <a href="https://towardsdatascience.com/yolo-v3-object-detection-53fb7d3bfe6b">YOLOv3</a> e <a href="https://www.mathworks.com/help/deeplearning/ref/resnet50.html">o ResNet50</a>.</p>
<p>👉Código-fonte: <a href="https://github.com/zilliz-bootcamp/video_analysis">zilliz-bootcamp/video_analysis</a></p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/4_54b4ceb2ad.png" alt="4.png" class="doc-image" id="4.png" />
   </span> <span class="img-wrapper"> <span>4.png</span> </span></p>
<h4 id="How-to-use" class="common-anchor-header">Como utilizar</h4><ol>
<li>Carregue um conjunto de dados de imagem zipado composto apenas por ficheiros .jpg (não são aceites outros tipos de ficheiros de imagem). Certifique-se de que cada ficheiro de imagem tem o nome do objeto que representa. Em alternativa, está disponível para transferência um <a href="https://zilliz.com/solutions/video-obj-analysis">conjunto de dados de amostra</a>.</li>
<li>Carregue um vídeo para utilizar na análise.</li>
<li>Clique no botão de reprodução para ver o vídeo carregado com os resultados da deteção de objectos mostrados em tempo real.</li>
</ol>
<p>👉Vídeo: <a href="https://www.youtube.com/watch?v=m9rosLClByc">[Demonstração] Sistema de deteção de objectos em vídeo com tecnologia Milvus</a></p>
<h4 id="How-it-works" class="common-anchor-header">Como funciona</h4><p>As imagens de objectos são convertidas em vectores de caraterísticas de 2048 dimensões utilizando o ResNet50. Em seguida, o Milvus é utilizado para gerir e consultar o conjunto de dados.</p>
<p><strong>Processamento de dados:</strong></p>
<ol>
<li>O ResNet50 converte imagens de objectos em vectores de caraterísticas de 2048 dimensões. Os vectores são depois importados para o Milvus e são-lhes atribuídos IDs individuais.</li>
<li>Os IDs dos vectores de caraterísticas de áudio e os caminhos dos ficheiros de imagem correspondentes são armazenados no MySQL.</li>
</ol>
<p><strong>Deteção de objectos no vídeo:</strong></p>
<ol>
<li>O OpenCV é utilizado para cortar o vídeo.</li>
<li>O YOLOv3 é utilizado para detetar objectos no vídeo.</li>
<li>O ResNet50 converte as imagens dos objectos detectados em vectores de caraterísticas de 2048 dimensões.</li>
</ol>
<p>O Milvus procura as imagens de objectos mais semelhantes no conjunto de dados carregado. Os nomes dos objectos correspondentes e os caminhos dos ficheiros de imagem são recuperados do MySQL.</p>
