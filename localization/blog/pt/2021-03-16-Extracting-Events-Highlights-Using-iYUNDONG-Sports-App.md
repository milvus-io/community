---
id: Extracting-Events-Highlights-Using-iYUNDONG-Sports-App.md
title: Extração de destaques de eventos utilizando a aplicação iYUNDONG Sports
author: milvus
date: 2021-03-16T03:41:30.983Z
desc: >-
  Fazer com Milvus Sistema inteligente de recuperação de imagens para desporto
  App iYUNDONG
cover: assets.zilliz.com/blog_iyundong_6db0f70ef4.jpg
tag: Scenarios
canonicalUrl: 'https://zilliz.com/blog/Extracting-Events-Highlights-Using-iYUNDONG-Sports-App'
---
<custom-h1>Extrair os destaques do evento utilizando a aplicação desportiva iYUNDONG</custom-h1><p>A iYUNDONG é uma empresa da Internet que pretende envolver mais amantes do desporto e participantes em eventos como corridas de maratona. Constrói ferramentas <a href="https://en.wikipedia.org/wiki/Artificial_intelligence">de inteligência artificial (IA)</a> que podem analisar os meios de comunicação captados durante eventos desportivos para gerar automaticamente os destaques. Por exemplo, ao carregar uma selfie, um utilizador da aplicação desportiva iYUNDONG que tenha participado num evento desportivo pode recuperar instantaneamente as suas próprias fotografias ou clips de vídeo a partir de um enorme conjunto de dados dos meios de comunicação social do evento.</p>
<p>Uma das principais caraterísticas da aplicação iYUNDONG chama-se "Encontrar-me em movimento".  Normalmente, os fotógrafos tiram grandes quantidades de fotografias ou vídeos durante um evento desportivo, como uma maratona, e carregam as fotografias e os vídeos em tempo real para a base de dados de meios de comunicação iYUNDONG. Os corredores de maratona que queiram ver os seus momentos mais marcantes podem recuperar fotografias que incluam eles próprios, bastando para isso carregar uma das suas selfies. Isto poupa-lhes muito tempo porque um sistema de recuperação de imagens na aplicação iYUNDONG faz toda a correspondência de imagens. O <a href="https://milvus.io/">Milvus</a> foi adotado pela iYUNDONG para alimentar este sistema, uma vez que o Milvus pode acelerar consideravelmente o processo de recuperação e apresentar resultados altamente precisos.</p>
<p><br/></p>
<p><strong>Ir para:</strong></p>
<ul>
<li><a href="#extracting-event-highlights-using-iyundong-sports-app">Extração de destaques de eventos usando o aplicativo iYUNDONG Sports</a><ul>
<li><a href="#difficulties-and-solutions">Dificuldades e soluções</a></li>
<li><a href="#what-is-milvus">O que é Milvus</a>- <a href="#an-overview-of-milvus"><em>Uma visão geral do Milvus.</em></a></li>
<li><a href="#why-milvus">Porquê Milvus</a></li>
<li><a href="#system-and-workflow">Sistema e fluxo de trabalho</a></li>
<li><a href="#iyundong-app-interface">Interface da aplicação iYUNDONG</a>- <a href="#iyundong-app-interface-1"><em>Interface da aplicação iYUNDONG.</em></a></li>
<li><a href="#conclusion">Conclusão</a></li>
</ul></li>
</ul>
<p><br/></p>
<h3 id="Difficulties-and-solutions" class="common-anchor-header">Dificuldades e soluções</h3><p>A iYUNDONG enfrentou os seguintes problemas e encontrou com sucesso as soluções correspondentes ao criar o seu sistema de recuperação de imagens.</p>
<ul>
<li>As fotografias de eventos devem estar imediatamente disponíveis para pesquisa.</li>
</ul>
<p>A iYUNDONG desenvolveu uma função chamada InstantUpload para garantir que as fotografias de eventos estejam disponíveis para pesquisa imediatamente após serem carregadas.</p>
<ul>
<li>Armazenamento de conjuntos de dados maciços</li>
</ul>
<p>Dados enormes, como fotos e vídeos, são carregados no backend da iYUNDONG a cada milésimo de segundo. Por isso, a iYUNDONG decidiu migrar para sistemas de armazenamento na nuvem, incluindo <a href="https://aws.amazon.com/">AWS</a>, <a href="https://aws.amazon.com/s3/?nc1=h_ls">S3</a> e <a href="https://www.alibabacloud.com/product/oss">Alibaba Cloud Object Storage Service (OSS)</a>, para tratar volumes gigantescos de dados não estruturados de forma segura, rápida e fiável.</p>
<ul>
<li>Leitura instantânea</li>
</ul>
<p>Para conseguir uma leitura instantânea, a iYUNDONG desenvolveu o seu próprio middleware de fragmentação para conseguir facilmente uma escalabilidade horizontal e reduzir o impacto da leitura em disco no sistema. Além disso, <a href="https://redis.io/">o Redis</a> é utilizado como camada de cache para garantir um desempenho consistente em situações de elevada concorrência.</p>
<ul>
<li>Extração instantânea de caraterísticas faciais</li>
</ul>
<p>Para extrair com precisão e eficácia as caraterísticas faciais das fotografias carregadas pelos utilizadores, a iYUNDONG desenvolveu um algoritmo próprio de conversão de imagens que as converte em vectores de caraterísticas de 128 dimensões. Outro problema encontrado foi o facto de, muitas vezes, muitos utilizadores e fotógrafos carregarem imagens ou vídeos em simultâneo. Por isso, os engenheiros de sistemas precisavam de ter em consideração a escalabilidade dinâmica quando implementavam o sistema. Mais especificamente, a iYUNDONG aproveitou totalmente o seu serviço de computação elástica (ECS) na nuvem para conseguir um escalonamento dinâmico.</p>
<ul>
<li>Pesquisa vetorial rápida e em grande escala</li>
</ul>
<p>A iYUNDONG precisava de uma base de dados de vectores para armazenar o seu grande número de vectores de caraterísticas extraídos por modelos de IA. De acordo com o seu próprio cenário de aplicação empresarial único, a iYUNDONG esperava que a base de dados de vectores fosse capaz de:</p>
<ol>
<li>Realizar uma recuperação de vectores extremamente rápida em conjuntos de dados ultra grandes.</li>
<li>Conseguir armazenamento em massa a custos mais baixos.</li>
</ol>
<p>Inicialmente, era processada uma média de 1 milhão de imagens por ano, pelo que a iYUNDONG armazenava todos os seus dados para pesquisa na RAM. No entanto, nos últimos dois anos, o seu negócio cresceu e assistiu a um crescimento exponencial de dados não estruturados - o número de imagens na base de dados da iYUNDONG excedeu 60 milhões em 2019, o que significa que havia mais de mil milhões de vectores de caraterísticas que precisavam de ser armazenados. Uma enorme quantidade de dados tornou inevitavelmente o sistema iYUNDONG pesado e consumidor de recursos. Por isso, teve de investir continuamente em instalações de hardware para garantir um elevado desempenho. Especificamente, o iYUNDONG implementou mais servidores de pesquisa, maior memória RAM e uma CPU com melhor desempenho para alcançar maior eficiência e escalabilidade horizontal. No entanto, uma das desvantagens desta solução era o facto de os custos de funcionamento serem proibitivamente elevados. Por conseguinte, a iYUNDONG começou a explorar uma solução melhor para este problema e ponderou a possibilidade de utilizar bibliotecas de índices vectoriais como a Faiss para poupar custos e orientar melhor a sua atividade. Finalmente, a iYUNDONG escolheu a base de dados vetorial de código aberto Milvus.</p>
<p><br/></p>
<h3 id="What-is-Milvus" class="common-anchor-header">O que é o Milvus</h3><p>O Milvus é uma base de dados vetorial de código aberto fácil de utilizar, altamente flexível, fiável e extremamente rápida. Combinado com vários modelos de aprendizagem profunda, como o reconhecimento de fotografias e voz, o processamento de vídeo e o processamento de linguagem natural, o Milvus pode processar e analisar dados não estruturados que são convertidos em vectores através da utilização de vários algoritmos de IA. Abaixo está o fluxo de trabalho de como o Milvus processa todos os dados não estruturados:</p>
<p>Os dados não estruturados são convertidos em vetores de incorporação por modelos de aprendizagem profunda ou outros algoritmos de IA.</p>
<p>Em seguida, os vetores de incorporação são inseridos no Milvus para armazenamento. O Milvus também cria índices para esses vetores.</p>
<p>O Milvus realiza pesquisas por semelhança e apresenta resultados de pesquisa precisos com base em várias necessidades comerciais.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/i_YUNDONG_Blog_1_d8abe065ae.png" alt="iYUNDONG Blog 1.png" class="doc-image" id="iyundong-blog-1.png" />
   </span> <span class="img-wrapper"> <span>Blogue iYUNDONG 1.png</span> </span></p>
<p><br/></p>
<h3 id="Why-Milvus" class="common-anchor-header">Porquê Milvus</h3><p>Desde o final de 2019, a iYUNDONG realizou uma série de testes sobre a utilização do Milvus para alimentar o seu sistema de recuperação de imagens. Os resultados dos testes mostraram que o Milvus supera outros bancos de dados vetoriais convencionais, pois suporta vários índices e pode reduzir eficientemente o uso de RAM, comprimindo significativamente a linha do tempo para a pesquisa de similaridade vetorial.</p>
<p>Além disso, são lançadas regularmente novas versões do Milvus. Durante o período de testes, o Milvus passou por várias actualizações de versão, da v0.6.0 à v0.10.1.</p>
<p>Além disso, com a sua comunidade de código aberto ativa e as suas poderosas funcionalidades prontas a utilizar, o Milvus permite à iYUNDONG funcionar com um orçamento de desenvolvimento reduzido.</p>
<p><br/></p>
<h3 id="System-and-Workflow" class="common-anchor-header">Sistema e fluxo de trabalho</h3><p>O sistema da iYUNDONG extrai as caraterísticas faciais detectando primeiro os rostos nas fotografias de eventos carregadas pelos fotógrafos. Em seguida, essas caraterísticas faciais são convertidas em vectores de 128 dimensões e armazenadas na biblioteca Milvus. O Milvus cria índices para esses vectores e pode apresentar instantaneamente resultados altamente precisos.</p>
<p>Outras informações adicionais, como IDs de fotografias e coordenadas que indicam a posição de um rosto numa fotografia, são armazenadas numa base de dados de terceiros.</p>
<p>Cada vetor de caraterísticas tem o seu ID único na biblioteca Milvus. A iYUNDONG adoptou o <a href="https://github.com/Meituan-Dianping/Leaf">algoritmo Leaf</a>, um serviço de geração de ID distribuído desenvolvido pela plataforma básica de I&amp;D <a href="https://about.meituan.com/en">da Meituan</a>, para associar o ID do vetor no Milvus à informação adicional correspondente armazenada noutra base de dados. Combinando o vetor de caraterísticas e a informação adicional, o sistema iYUNDONG pode apresentar resultados semelhantes na pesquisa do utilizador.</p>
<p><br/></p>
<h3 id="iYUNDONG-App-Interface" class="common-anchor-header">Interface da aplicação iYUNDONG</h3><p>A página inicial apresenta uma série de eventos desportivos recentes. Ao tocar num dos eventos, os utilizadores podem ver todos os pormenores.</p>
<p>Depois de tocar no botão na parte superior da página da galeria de fotografias, os utilizadores podem carregar uma fotografia sua para obter imagens dos seus destaques.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/iyundong_interface_3da684d206.jpg" alt="iyundong-interface.jpg" class="doc-image" id="iyundong-interface.jpg" />
   </span> <span class="img-wrapper"> <span>iyundong-interface.jpg</span> </span></p>
<p><br/></p>
<h3 id="Conclusion" class="common-anchor-header">Conclusão</h3><p>Este artigo apresenta a forma como a aplicação iYUNDONG cria um sistema inteligente de recuperação de imagens que pode fornecer resultados de pesquisa precisos com base nas fotografias carregadas pelo utilizador, que variam em termos de resolução, tamanho, nitidez, ângulo e outras formas que complicam a pesquisa de semelhanças. Com a ajuda do Milvus, a aplicação iYUNDONG pode executar com êxito pesquisas ao nível dos milissegundos numa base de dados de mais de 60 milhões de imagens. E a taxa de precisão da recuperação de fotos é constantemente superior a 92%. Milvus facilita à iYUNDONG a criação de um sistema de recuperação de imagens poderoso e de nível empresarial num curto espaço de tempo e com recursos limitados.</p>
<p>Leia outras <a href="https://zilliz.com/user-stories">histórias de utilizadores</a> para saber mais sobre como fazer coisas com Milvus.</p>
