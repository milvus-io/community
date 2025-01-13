---
id: Making-with-Milvus-Detecting-Android-Viruses-in-Real-Time-for-Trend-Micro.md
title: Fazendo com Milvus Detectando vírus Android em tempo real para a Trend Micro
author: milvus
date: 2021-04-23T06:46:13.732Z
desc: >-
  Saiba como o Milvus é utilizado para mitigar as ameaças aos dados críticos e
  reforçar a cibersegurança com a deteção de vírus em tempo real.
cover: assets.zilliz.com/blog_Trend_Micro_5c8ba3e2ce.jpg
tag: Scenarios
canonicalUrl: >-
  https://zilliz.com/blog/Making-with-Milvus-Detecting-Android-Viruses-in-Real-Time-for-Trend-Micro
---
<custom-h1>Fazendo com Milvus: Detectando vírus Android em tempo real para a Trend Micro</custom-h1><p>A cibersegurança continua a ser uma ameaça persistente tanto para os indivíduos como para as empresas, com as preocupações com a privacidade dos dados a aumentarem para <a href="https://www.getapp.com/resources/annual-data-security-report/">86% das empresas</a> em 2020 e apenas <a href="https://merchants.fiserv.com/content/dam/firstdata/us/en/documents/pdf/digital-commerce-cybersecurity-ebook.pdf">23% dos consumidores</a> a acreditarem que os seus dados pessoais estão muito seguros. À medida que o malware se torna cada vez mais omnipresente e sofisticado, uma abordagem proactiva à deteção de ameaças tornou-se essencial. <a href="https://www.trendmicro.com/en_us/business.html">A Trend Micro</a> é líder mundial em segurança de nuvem híbrida, defesa de rede, segurança de pequenas empresas e segurança de terminais. Para proteger os dispositivos Android contra vírus, a empresa criou a Trend Micro Mobile Security - uma aplicação móvel que compara APKs (Android Application Package) da Google Play Store com uma base de dados de malware conhecido. O sistema de deteção de vírus funciona da seguinte forma:</p>
<ul>
<li>Os APKs externos (pacote de aplicações Android) da Google Play Store são rastreados.</li>
<li>O malware conhecido é convertido em vectores e armazenado no <a href="https://www.milvus.io/docs/v1.0.0/overview.md">Milvus</a>.</li>
<li>Os novos APKs são também convertidos em vectores e depois comparados com a base de dados de malware através da pesquisa de semelhanças.</li>
<li>Se um vetor APK for semelhante a qualquer um dos vectores de malware, a aplicação fornece aos utilizadores informações detalhadas sobre o vírus e o seu nível de ameaça.</li>
</ul>
<p>Para funcionar, o sistema tem de efetuar uma pesquisa de semelhanças altamente eficiente em conjuntos de dados de vectores maciços em tempo real. Inicialmente, a Trend Micro utilizava <a href="https://www.mysql.com/">o MySQL</a>. No entanto, à medida que o seu negócio se expandiu, também aumentou o número de APKs com código nefasto armazenado na sua base de dados. A equipa de algoritmos da empresa começou a procurar soluções alternativas de pesquisa de semelhanças vectoriais depois de ultrapassar rapidamente o MySQL.</p>
<p><br/></p>
<h3 id="Comparing-vector-similarity-search-solutions" class="common-anchor-header">Comparação de soluções de pesquisa de semelhança de vectores</h3><p>Existem várias soluções de pesquisa de semelhança de vectores disponíveis, muitas das quais são de código aberto. Embora as circunstâncias variem de projeto para projeto, a maioria dos utilizadores beneficia da utilização de uma base de dados vetorial criada para processamento e análise de dados não estruturados, em vez de uma simples biblioteca que requer uma configuração extensiva. Abaixo, comparamos algumas soluções populares de pesquisa de similaridade de vetores e explicamos por que a Trend Micro escolheu o Milvus.</p>
<h4 id="Faiss" class="common-anchor-header">Faiss</h4><p><a href="https://ai.facebook.com/tools/faiss/">Faiss</a> é uma biblioteca desenvolvida pela Facebook AI Research que permite a pesquisa de semelhança eficiente e o agrupamento de vectores densos. Os algoritmos que contém pesquisam vectores de qualquer tamanho em conjuntos. Faiss é escrita em C++ com wrappers para Python/numpy, e suporta vários índices, incluindo IndexFlatL2, IndexFlatIP, HNSW e IVF.</p>
<p>Embora o Faiss seja uma ferramenta incrivelmente útil, ele tem limitações. Funciona apenas como uma biblioteca básica de algoritmos e não como uma base de dados para gerir conjuntos de dados vectoriais. Além disso, não oferece uma versão distribuída, serviços de monitorização, SDKs ou alta disponibilidade, que são as principais caraterísticas da maioria dos serviços baseados na nuvem.</p>
<h4 id="Plug-ins-based-on-Faiss--other-ANN-search-libraries" class="common-anchor-header">Plug-ins baseados em Faiss e noutras bibliotecas de pesquisa ANN</h4><p>Existem vários plug-ins criados com base no Faiss, no NMSLIB e noutras bibliotecas de pesquisa ANN, concebidos para melhorar a funcionalidade básica da ferramenta subjacente que os alimenta. O Elasticsearch (ES) é um motor de pesquisa baseado na biblioteca Lucene com uma série de plug-ins deste tipo. Abaixo está um diagrama de arquitetura de um plug-in ES:</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1_3ce4e516c3.png" alt="1.png" class="doc-image" id="1.png" />
   </span> <span class="img-wrapper"> <span>1.png</span> </span></p>
<p>O suporte integrado para sistemas distribuídos é uma das principais vantagens de uma solução ES. Isto poupa tempo aos programadores e dinheiro às empresas graças ao código que não tem de ser escrito. Os plug-ins ES são tecnicamente avançados e predominantes. O Elasticsearch fornece uma QueryDSL (linguagem específica do domínio), que define consultas baseadas em JSON e é fácil de compreender. Um conjunto completo de serviços ES permite efetuar pesquisas vectoriais/texto e filtrar dados escalares em simultâneo.</p>
<p>A Amazon, a Alibaba e a Netease são algumas das grandes empresas de tecnologia que dependem atualmente dos plug-ins do Elasticsearch para a pesquisa de semelhanças vectoriais. As principais desvantagens desta solução são o elevado consumo de memória e a ausência de suporte para afinação do desempenho. Em contrapartida, <a href="http://jd.com/">a JD.com</a> desenvolveu a sua própria solução distribuída baseada no Faiss, denominada <a href="https://github.com/vearch/vearch">Vearch</a>. No entanto, o Vearch ainda é um projeto em fase de incubação e a sua comunidade de código aberto é relativamente inativa.</p>
<h4 id="Milvus" class="common-anchor-header">Milvus</h4><p><a href="https://www.milvus.io/">O Milvus</a> é uma base de dados vetorial de código aberto criada pela <a href="https://zilliz.com">Zilliz</a>. É altamente flexível, fiável e extremamente rápida. Ao encapsular várias bibliotecas de índices amplamente adoptadas, como Faiss, NMSLIB e Annoy, o Milvus fornece um conjunto abrangente de APIs intuitivas, permitindo que os programadores escolham o tipo de índice ideal para o seu cenário. Também fornece soluções distribuídas e serviços de monitorização. O Milvus tem uma comunidade de código aberto altamente ativa e mais de 5,5 mil estrelas no <a href="https://github.com/milvus-io/milvus">Github</a>.</p>
<h4 id="Milvus-bests-the-competition" class="common-anchor-header">Milvus supera a concorrência</h4><p>Compilámos uma série de resultados de testes diferentes das várias soluções de pesquisa de semelhança de vectores mencionadas acima. Como podemos ver na seguinte tabela de comparação, o Milvus foi significativamente mais rápido do que a concorrência, apesar de ter sido testado num conjunto de dados de mil milhões de vectores de 128 dimensões.</p>
<table>
<thead>
<tr><th style="text-align:left"><strong>Motor</strong></th><th style="text-align:left"><strong>Desempenho (ms)</strong></th><th style="text-align:left"><strong>Tamanho do conjunto de dados (milhões)</strong></th></tr>
</thead>
<tbody>
<tr><td style="text-align:left">ES</td><td style="text-align:left">600</td><td style="text-align:left">1</td></tr>
<tr><td style="text-align:left">ES + Alibaba Cloud</td><td style="text-align:left">900</td><td style="text-align:left">20</td></tr>
<tr><td style="text-align:left">Milvus</td><td style="text-align:left">27</td><td style="text-align:left">1000+</td></tr>
<tr><td style="text-align:left">SPTAG</td><td style="text-align:left">Não é bom</td><td style="text-align:left"></td></tr>
<tr><td style="text-align:left">ES + nmslib, faiss</td><td style="text-align:left">90</td><td style="text-align:left">150</td></tr>
</tbody>
</table>
<h6 id="A-comparison-of-vector-similarity-search-solutions" class="common-anchor-header"><em>Uma comparação de soluções de pesquisa de similaridade de vetor.</em></h6><p>Depois de pesar os prós e contras de cada solução, a Trend Micro optou pelo Milvus para seu modelo de recuperação de vetor. Com um desempenho excecional em conjuntos de dados maciços, à escala de mil milhões, é óbvio porque é que a empresa escolheu o Milvus para um serviço de segurança móvel que requer uma pesquisa de semelhança de vectores em tempo real.</p>
<p><br/></p>
<h3 id="Designing-a-system-for-real-time-virus-detection" class="common-anchor-header">Conceber um sistema de deteção de vírus em tempo real</h3><p>A Trend Micro tem mais de 10 milhões de APKs maliciosos armazenados na sua base de dados MySQL, com 100 mil novos APKs adicionados todos os dias. O sistema funciona extraindo e calculando os valores Thash de diferentes componentes de um ficheiro APK e, em seguida, utiliza o algoritmo Sha256 para o transformar em ficheiros binários e gerar valores Sha256 de 256 bits que diferenciam o APK dos outros. Uma vez que os valores Sha256 variam com os ficheiros APK, um APK pode ter um valor Thash combinado e um valor Sha256 único.</p>
<p>Os valores Sha256 são usados apenas para diferenciar APKs, e os valores Thash são usados para recuperação de similaridade de vetor. APKs semelhantes podem ter os mesmos valores Thash mas valores Sha256 diferentes.</p>
<p>Para detetar APKs com código nefasto, a Trend Micro desenvolveu seu próprio sistema para recuperar valores Thash semelhantes e valores Sha256 correspondentes. A Trend Micro escolheu o Milvus para realizar uma pesquisa instantânea de semelhança de vectores em conjuntos de dados de vectores maciços convertidos a partir de valores Thash. Após a execução da pesquisa de semelhança, os valores Sha256 correspondentes são consultados no MySQL. Uma camada de cache Redis também é adicionada à arquitetura para mapear valores Thash para valores Sha256, reduzindo significativamente o tempo de consulta.</p>
<p>Abaixo está o diagrama de arquitetura do sistema de segurança móvel da Trend Micro.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/image_20210118_022039_ae824b663c.png" alt="image-20210118-022039.png" class="doc-image" id="image-20210118-022039.png" />
   </span> <span class="img-wrapper"> <span>image-20210118-022039.png</span> </span></p>
<p><br/></p>
<p>A escolha de uma métrica de distância adequada ajuda a melhorar a classificação do vetor e o desempenho do agrupamento. A tabela seguinte mostra as <a href="https://www.milvus.io/docs/v1.0.0/metric.md#binary">métricas de distância</a> e os índices correspondentes que funcionam com vectores binários.</p>
<table>
<thead>
<tr><th><strong>Métrica de distância</strong></th><th><strong>Tipos de índice</strong></th></tr>
</thead>
<tbody>
<tr><td>- Jaccard <br/> - Tanimoto <br/> - Hamming</td><td>- PLANO <br/> - IVF_FLAT</td></tr>
<tr><td>- Superestrutura <br/> - Subestrutura</td><td>FLAT</td></tr>
</tbody>
</table>
<h6 id="Distance-metrics-and-indexes-for-binary-vectors" class="common-anchor-header"><em>Métricas de distância e índices para vectores binários.</em></h6><p><br/></p>
<p>A Trend Micro converte os valores Thash em vectores binários e armazena-os em Milvus. Para este cenário, a Trend Micro está a utilizar a distância de Hamming para comparar vectores.</p>
<p>Em breve, o Milvus suportará ID de vetor de cadeia de caracteres, e os IDs inteiros não precisarão ser mapeados para o nome correspondente no formato de cadeia de caracteres. Isto torna a camada de cache Redis desnecessária e a arquitetura do sistema menos volumosa.</p>
<p>A Trend Micro adota uma solução baseada em nuvem e implanta muitas tarefas no <a href="https://kubernetes.io/">Kubernetes</a>. Para obter alta disponibilidade, a Trend Micro usa <a href="https://www.milvus.io/docs/v1.0.0/mishards.md">o Mishards</a>, um middleware de fragmentação de cluster Milvus desenvolvido em Python.</p>
<p>![image-20210118-022104.png](https://assets.zilliz.com/image_20210118_022104_3001950ee8.png &quot;Mishards architecture in Milvus.)</p>
<p><br/></p>
<p>A Trend Micro separa o armazenamento e o cálculo da distância armazenando todos os vetores no <a href="https://aws.amazon.com/efs/">EFS</a> (Elastic File System) fornecido pela <a href="https://aws.amazon.com/">AWS</a>. Essa prática é uma tendência popular no setor. O Kubernetes é utilizado para iniciar vários nós de leitura e desenvolve serviços LoadBalancer nestes nós de leitura para garantir uma elevada disponibilidade.</p>
<p>Para manter a consistência dos dados, o Mishards suporta apenas um nó de escrita. No entanto, uma versão distribuída do Milvus com suporte para vários nós de escrita estará disponível nos próximos meses.</p>
<p><br/></p>
<h3 id="Monitoring-and-Alert-Functions" class="common-anchor-header">Funções de Monitorização e Alerta</h3><p>O Milvus é compatível com sistemas de monitoramento construídos no <a href="https://prometheus.io/">Prometheus</a> e usa <a href="https://grafana.com/">o Grafana</a>, uma plataforma de código aberto para análise de séries temporais, para visualizar várias métricas de desempenho.</p>
<p>O Prometheus monitora e armazena as seguintes métricas:</p>
<ul>
<li>Métricas de desempenho do Milvus, incluindo velocidade de inserção, velocidade de consulta e tempo de atividade do Milvus.</li>
<li>Métricas de desempenho do sistema, incluindo uso de CPU/GPU, tráfego de rede e velocidade de acesso ao disco.</li>
<li>Métricas de armazenamento de hardware, incluindo o tamanho dos dados e o número total de ficheiros.</li>
</ul>
<p>O sistema de monitorização e alerta funciona da seguinte forma:</p>
<ul>
<li>Um cliente Milvus envia dados de métricas personalizadas para o Pushgateway.</li>
<li>O Pushgateway garante que os dados de métricas efêmeros e de curta duração sejam enviados com segurança para o Prometheus.</li>
<li>O Prometheus continua extraindo dados do Pushgateway.</li>
<li>O Alertmanager define o limite de alerta para diferentes métricas e dispara alarmes por meio de e-mails ou mensagens.</li>
</ul>
<p><br/></p>
<h3 id="System-Performance" class="common-anchor-header">Desempenho do sistema</h3><p>Passaram-se alguns meses desde que o serviço ThashSearch construído sobre o Milvus foi lançado pela primeira vez. O gráfico abaixo mostra que a latência da consulta de ponta a ponta é inferior a 95 milissegundos.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/image_20210118_022116_a0c735ce20.png" alt="image-20210118-022116.png" class="doc-image" id="image-20210118-022116.png" />
   </span> <span class="img-wrapper"> <span>image-20210118-022116.png</span> </span></p>
<p><br/></p>
<p>A inserção também é rápida. São necessários cerca de 10 segundos para inserir 3 milhões de vectores de 192 dimensões. Com a ajuda da Milvus, o desempenho do sistema foi capaz de cumprir os critérios de desempenho definidos pela Trend Micro.</p>
<p><br/></p>
<h3 id="Don’t-be-a-stranger" class="common-anchor-header">Não seja um estranho</h3><ul>
<li>Encontre ou contribua para o Milvus no <a href="https://github.com/milvus-io/milvus/">GitHub</a>.</li>
<li>Interaja com a comunidade através do <a href="https://join.slack.com/t/milvusio/shared_invite/zt-e0u4qu3k-bI2GDNys3ZqX1YCJ9OM~GQ">Slack</a>.</li>
<li>Conecte-se conosco no <a href="https://twitter.com/milvusio">Twitter</a>.</li>
</ul>
