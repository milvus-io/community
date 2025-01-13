---
id: 2021-10-10-milvus-helps-analyze-videos.md
title: Deteção de objectos
author: Shiyu Chen
date: 2021-10-11T00:00:00.000Z
desc: Saiba como Milvus potencia a análise de IA de conteúdos de vídeo.
cover: assets.zilliz.com/Who_is_it_e9d4510ace.png
tag: Scenarios
canonicalUrl: 'https://zilliz.com/blog/milvus-helps-analyze-videos-intelligently'
---
<custom-h1>Criação de um sistema de análise de vídeo com a base de dados vetorial Milvus</custom-h1><p><em>Shiyu Chen, engenheira de dados na Zilliz, licenciou-se em Ciências Informáticas na Universidade de Xidian. Desde que se juntou à Zilliz, tem vindo a explorar soluções para o Milvus em vários domínios, como a análise de áudio e vídeo, a recuperação de fórmulas de moléculas, etc., o que enriqueceu bastante os cenários de aplicação da comunidade. Atualmente, está a explorar mais soluções interessantes. No seu tempo livre, adora desporto e leitura.</em></p>
<p>Quando estava a ver o <em>Free Guy</em> no fim de semana passado, senti que já tinha visto o ator que faz de Buddy, o segurança, algures, mas não me lembrava de nenhum dos seus trabalhos. A minha cabeça estava cheia de "quem é este gajo?". Tinha a certeza de ter visto aquela cara e estava a esforçar-me por me lembrar do seu nome. Um caso semelhante é o de uma vez que vi o ator principal de um vídeo a beber uma bebida de que gostava muito, mas acabei por não me lembrar do nome da marca.</p>
<p>A resposta estava na ponta da língua, mas o meu cérebro estava completamente bloqueado.</p>
<p>O fenómeno da ponta da língua (TOT) deixa-me louco quando vejo filmes. Se ao menos existisse um motor de pesquisa de imagens invertido para vídeos que me permitisse encontrar vídeos e analisar o seu conteúdo. Antes, criei um <a href="https://github.com/milvus-io/bootcamp/tree/master/solutions/reverse_image_search/quick_deploy">motor de pesquisa de imagens invertido utilizando o Milvus</a>. Considerando que a análise de conteúdos de vídeo se assemelha de alguma forma à análise de imagens, decidi criar um motor de análise de conteúdos de vídeo com base no Milvus.</p>
<h2 id="Object-detection" class="common-anchor-header">Deteção de objectos<button data-href="#Object-detection" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Overview" class="common-anchor-header">Visão geral</h3><p>Antes de serem analisados, os objectos de um vídeo devem ser detectados. Detetar objectos num vídeo de forma eficaz e precisa é o principal desafio da tarefa. É também uma tarefa importante para aplicações como o piloto automático, dispositivos portáteis e IoT.</p>
<p>Desenvolvidos a partir de algoritmos tradicionais de processamento de imagem para redes neurais profundas (DNN), os principais modelos actuais para deteção de objectos incluem R-CNN, FRCNN, SSD e YOLO. O sistema de análise de vídeo de aprendizagem profunda baseado em Milvus apresentado neste tópico pode detetar objectos de forma inteligente e rápida.</p>
<h3 id="Implementation" class="common-anchor-header">Implementação</h3><p>Para detetar e reconhecer objectos num vídeo, o sistema deve, em primeiro lugar, extrair fotogramas de um vídeo e detetar objectos nas imagens dos fotogramas utilizando a deteção de objectos; em segundo lugar, extrair vectores de caraterísticas dos objectos detectados e, por último, analisar o objeto com base nos vectores de caraterísticas.</p>
<ul>
<li>Extração de fotogramas</li>
</ul>
<p>A análise de vídeo é convertida em análise de imagem através da extração de fotogramas. Atualmente, a tecnologia de extração de fotogramas está muito madura. Programas como o FFmpeg e o OpenCV suportam a extração de fotogramas em intervalos específicos. Este artigo apresenta como extrair fotogramas de um vídeo a cada segundo utilizando o OpenCV.</p>
<ul>
<li>Deteção de objectos</li>
</ul>
<p>A deteção de objectos consiste em encontrar objectos nos fotogramas extraídos e extrair imagens dos objectos de acordo com as suas posições. Como se pode ver nas figuras seguintes, foram detectados uma bicicleta, um cão e um carro. Este tópico apresenta a forma de detetar objectos utilizando o YOLOv3, que é normalmente utilizado para a deteção de objectos.</p>
<ul>
<li>Extração de caraterísticas</li>
</ul>
<p>A extração de caraterísticas refere-se à conversão de dados não estruturados, que são difíceis de reconhecer pelas máquinas, em vectores de caraterísticas. Por exemplo, as imagens podem ser convertidas em vectores de caraterísticas multidimensionais utilizando modelos de aprendizagem profunda. Atualmente, os modelos de IA de reconhecimento de imagem mais populares incluem VGG, GNN e ResNet. Este tópico apresenta como extrair caraterísticas de objectos detectados utilizando o ResNet-50.</p>
<ul>
<li>Análise de vectores</li>
</ul>
<p>Os vectores de caraterísticas extraídos são comparados com os vectores da biblioteca, sendo devolvidas as informações correspondentes aos vectores mais semelhantes. Para conjuntos de dados de vectores de caraterísticas em grande escala, o cálculo é um enorme desafio. Este tópico apresenta a forma de analisar vectores de caraterísticas utilizando o Milvus.</p>
<h2 id="Key-technologies" class="common-anchor-header">Tecnologias-chave<button data-href="#Key-technologies" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="OpenCV" class="common-anchor-header">OpenCV</h3><p>A Open Source Computer Vision Library (OpenCV) é uma biblioteca de visão computacional multiplataforma que fornece muitos algoritmos universais para processamento de imagem e visão computacional. O OpenCV é normalmente utilizado no domínio da visão computacional.</p>
<p>O exemplo seguinte mostra como capturar fotogramas de vídeo em intervalos especificados e guardá-los como imagens utilizando o OpenCV com Python.</p>
<pre><code translate="no" class="language-python"><span class="hljs-keyword">import</span> cv2 
<span class="hljs-built_in">cap</span> = cv2.VideoCapture(file_path)   
framerate = <span class="hljs-built_in">cap</span>.get(cv2.CAP_PROP_FPS)   
allframes = <span class="hljs-type">int</span>(cv2.VideoCapture.get(<span class="hljs-built_in">cap</span>, <span class="hljs-type">int</span>(cv2.CAP_PROP_FRAME_COUNT)))  
success, image = <span class="hljs-built_in">cap</span>.read() 
cv2.imwrite(file_name, image)
<button class="copy-code-btn"></button></code></pre>
<h3 id="YOLOv3" class="common-anchor-header">YOLOv3</h3><p>You Only Look Once, Version 3 (YOLOv3 [5]) é um algoritmo de deteção de objectos de uma fase proposto nos últimos anos. Em comparação com os algoritmos tradicionais de deteção de objectos com a mesma precisão, o YOLOv3 é duas vezes mais rápido. O YOLOv3 mencionado neste tópico é a versão melhorada do PaddlePaddle [6]. Utiliza múltiplos métodos de otimização com uma maior velocidade de inferência.</p>
<h3 id="ResNet-50" class="common-anchor-header">ResNet-50</h3><p>A ResNet [7] é a vencedora do ILSVRC 2015 na classificação de imagens devido à sua simplicidade e praticidade. Como base de muitos métodos de análise de imagens, o ResNet prova ser um modelo popular especializado em deteção, segmentação e reconhecimento de imagens.</p>
<h3 id="Milvus" class="common-anchor-header">Milvus</h3><p><a href="https://milvus.io/">O Milvus</a> é uma base de dados vetorial de código aberto, nativa da nuvem, criada para gerir vectores de incorporação gerados por modelos de aprendizagem automática e redes neurais. Ele é amplamente usado em cenários como visão computacional, processamento de linguagem natural, química computacional, sistemas de recomendação personalizados e muito mais.</p>
<p>Os procedimentos seguintes descrevem o funcionamento do Milvus.</p>
<ol>
<li>Os dados não estruturados são convertidos em vectores de caraterísticas utilizando modelos de aprendizagem profunda e são importados para o Milvus.</li>
<li>O Milvus armazena e indexa os vectores de caraterísticas.</li>
<li>O Milvus devolve os vectores mais semelhantes ao vetor consultado pelos utilizadores.</li>
</ol>
<h2 id="Deployment" class="common-anchor-header">Implementação<button data-href="#Deployment" class="anchor-icon" translate="no">
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
    </button></h2><p>Agora já sabe o que são os sistemas de análise de vídeo baseados em Milvus. O sistema é composto principalmente por duas partes, como mostra a figura seguinte.</p>
<ul>
<li><p>As setas vermelhas indicam o processo de importação de dados. Utilize o ResNet-50 para extrair vectores de caraterísticas do conjunto de dados de imagens e importe os vectores de caraterísticas para o Milvus.</p></li>
<li><p>As setas pretas indicam o processo de análise de vídeo. Em primeiro lugar, extrair fotogramas de um vídeo e guardar os fotogramas como imagens. Em segundo lugar, detetar e extrair objectos nas imagens utilizando o YOLOv3. Em seguida, utiliza o ResNet-50 para extrair vectores de caraterísticas das imagens. Por fim, o Milvus procura e devolve as informações dos objectos com os vectores de caraterísticas correspondentes.</p></li>
</ul>
<p>Para mais informações, consulte <a href="https://github.com/milvus-io/bootcamp/tree/master/solutions/video_similarity_search/object_detection">Milvus Bootcamp: Sistema de deteção de objectos de vídeo</a>.</p>
<p><strong>Importação de dados</strong></p>
<p>O processo de importação de dados é simples. Converta os dados em vectores de 2.048 dimensões e importe os vectores para o Milvus.</p>
<pre><code translate="no" class="language-python">vector = image_encoder.execute(filename)
entities = [vector]
collection.insert(data=entities)
<button class="copy-code-btn"></button></code></pre>
<p><strong>Análise de vídeo</strong></p>
<p>Tal como referido anteriormente, o processo de análise de vídeo inclui a captura de fotogramas de vídeo, a deteção de objectos em cada fotograma, a extração de vectores dos objectos, o cálculo da similaridade dos vectores com a métrica da distância euclidiana (L2) e a pesquisa de resultados utilizando o Milvus.</p>
<pre><code translate="no" class="language-python">images = extract_frame(filename, 1, prefix)   
detector = Detector()   
run(detector, DATA_PATH)       
vectors = get_object_vector(image_encoder, DATA_PATH)
search_params = {<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;L2&quot;</span>, <span class="hljs-string">&quot;params&quot;</span>: {<span class="hljs-string">&quot;nprobe&quot;</span>: 10}}
results = collection.search(vectors, param=search_params, <span class="hljs-built_in">limit</span>=10)
<button class="copy-code-btn"></button></code></pre>
<h2 id="Conclusion" class="common-anchor-header">Conclusão<button data-href="#Conclusion" class="anchor-icon" translate="no">
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
    </button></h2><p>Atualmente, mais de 80% dos dados não estão estruturados. Com o rápido desenvolvimento da IA, foi desenvolvido um número crescente de modelos de aprendizagem profunda para analisar dados não estruturados. Tecnologias como a deteção de objectos e o processamento de imagens alcançaram grandes avanços tanto no meio académico como na indústria. Graças a estas tecnologias, cada vez mais plataformas de IA satisfazem requisitos práticos.</p>
<p>O sistema de análise de vídeo abordado neste tópico foi criado com o Milvus, que pode analisar rapidamente conteúdos de vídeo.</p>
<p>Sendo uma base de dados vetorial de código aberto, o Milvus suporta vectores de caraterísticas extraídos através de vários modelos de aprendizagem profunda. Integrado com bibliotecas como Faiss, NMSLIB e Annoy, o Milvus fornece um conjunto de APIs intuitivas, suportando a mudança de tipos de índice de acordo com os cenários. Além disso, o Milvus suporta filtragem escalar, o que aumenta a taxa de recuperação e a flexibilidade da pesquisa. O Milvus tem sido aplicado em muitas áreas, como processamento de imagem, visão computacional, processamento de linguagem natural, reconhecimento de fala, sistema de recomendação e descoberta de novos medicamentos.</p>
<h2 id="References" class="common-anchor-header">Referências<button data-href="#References" class="anchor-icon" translate="no">
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
    </button></h2><p>[1] A. D. Bagdanov, L. Ballan, M. Bertini, A. Del Bimbo. "Correspondência e recuperação de marcas comerciais em bases de dados de vídeos desportivos". Actas do workshop internacional sobre Workshop sobre recuperação de informação multimédia, ACM, 2007. https://www.researchgate.net/publication/210113141_Trademark_matching_and_retrieval_in_sports_video_databases</p>
<p>[2] J. Kleban, X. Xie, W.-Y. Ma. "Spatial pyramid mining for logo detection in natural scenes" [Extração de pirâmides espaciais para deteção de logótipos em cenas naturais]. Conferência Internacional do IEEE, 2008. https://ieeexplore.ieee.org/document/4607625</p>
<p>[3] R. Boia, C. Florea, L. Florea, R. Dogaru. "Localização e reconhecimento de logótipos em imagens naturais utilizando gráficos de classes homográficas". Machine Vision and Applications 27 (2), 2016. https://link.springer.com/article/10.1007/s00138-015-0741-7</p>
<p>[4] R. Boia, C. Florea, L. Florea. "Aglomeração de asift elíptico em protótipo de classe para deteção de logotipo". BMVC, 2015. http://citeseerx.ist.psu.edu/viewdoc/download;jsessionid=5C87F52DE38AB0C90F8340DFEBB841F7?doi=10.1.1.707.9371&amp;rep=rep1&amp;type=pdf</p>
<p>[5] https://arxiv.org/abs/1804.02767</p>
<p>[6] https://paddlepaddle.org.cn/modelbasedetail/yolov3</p>
<p>[7] https://arxiv.org/abs/1512.03385</p>
