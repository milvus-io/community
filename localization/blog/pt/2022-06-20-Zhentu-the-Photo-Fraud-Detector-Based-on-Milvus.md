---
id: 2022-06-20-Zhentu-the-Photo-Fraud-Detector-Based-on-Milvus.md
title: Zhentu - o detetor de fraudes fotográficas baseado em Milvus
author: 'Yan Shi, Minwei Tang'
date: 2022-06-20T00:00:00.000Z
desc: >-
  Como é que o sistema de deteção da Zhentu é construído com o Milvus como motor
  de pesquisa de vectores?
cover: assets.zilliz.com/zhentu_0ae11c98ee.png
tag: Scenarios
tags: Use Cases of Milvus
canonicalUrl: >-
  https://milvus.io/blog/2022-06-20-Zhentu-the-Photo-Fraud-Detector-Based-on-Milvus.md
---
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/zhentu_0ae11c98ee.png" alt="cover image" class="doc-image" id="cover-image" />
   </span> <span class="img-wrapper"> <span>imagem da capa</span> </span></p>
<blockquote>
<p>Este artigo foi escrito por Yan Shi e Minwei Tang, engenheiros de algoritmos sénior da BestPay, e traduzido por <a href="https://www.linkedin.cn/incareer/in/rosie-zhang-694528149">Rosie Zhang</a>.</p>
</blockquote>
<p>Nos últimos anos, à medida que o comércio eletrónico e as transacções em linha se tornaram comuns em todo o mundo, a fraude no comércio eletrónico também floresceu. Ao utilizarem fotografias geradas por computador em vez de fotografias reais para passarem na verificação da identidade nas plataformas comerciais em linha, os autores de fraudes criam contas falsas em grande escala e aproveitam as ofertas especiais das empresas (por exemplo, ofertas de adesão, cupões, fichas), o que traz prejuízos irreparáveis tanto para os consumidores como para as empresas.</p>
<p>Os métodos tradicionais de controlo do risco já não são eficazes face a uma quantidade substancial de dados. Para resolver o problema, <a href="https://www.bestpay.com.cn">a BestPay</a> criou um detetor de fraudes fotográficas, o Zhentu (que significa detetar imagens em chinês), baseado em tecnologias de aprendizagem profunda (DL) e de processamento digital de imagens (DIP). O Zhentu é aplicável a vários cenários que envolvem o reconhecimento de imagens, sendo uma importante ramificação a identificação de licenças comerciais falsas. Se a fotografia da licença comercial submetida por um utilizador for muito semelhante a outra fotografia já existente na biblioteca de fotografias de uma plataforma, é provável que o utilizador tenha roubado a fotografia algures ou tenha forjado uma licença para fins fraudulentos.</p>
<p>Os algoritmos tradicionais para medir a semelhança de imagens, como o <a href="https://en.wikipedia.org/wiki/Peak_signal-to-noise_ratio">PSNR</a> e o ORB, são lentos e imprecisos, sendo apenas aplicáveis a tarefas offline. A aprendizagem profunda, por outro lado, é capaz de processar dados de imagem em grande escala em tempo real e é o melhor método para fazer corresponder imagens semelhantes. Com os esforços conjuntos da equipa de I&amp;D da BestPay e da <a href="https://milvus.io/">comunidade Milvus</a>, foi desenvolvido um sistema de deteção de fraudes fotográficas como parte do Zhentu. Este sistema funciona convertendo grandes quantidades de dados de imagem em vectores de caraterísticas através de modelos de aprendizagem profunda e inserindo-os no <a href="https://milvus.io/">Milvus</a>, um motor de pesquisa de vectores. Com o Milvus, o sistema de deteção é capaz de indexar triliões de vectores e recuperar eficazmente fotografias semelhantes entre dezenas de milhões de imagens.</p>
<p><strong>Saltar para:</strong></p>
<ul>
<li><a href="#an-overview-of-zhentu">Uma visão geral do Zhentu</a></li>
<li><a href="#system-structure">Estrutura do sistema</a></li>
<li><a href="#deployment"><strong>Implementação</strong></a></li>
<li><a href="#real-world-performance"><strong>Desempenho no mundo real</strong></a></li>
<li><a href="#reference"><strong>Referência</strong></a></li>
<li><a href="#about-bestpay"><strong>Sobre a BestPay</strong></a></li>
</ul>
<h2 id="An-overview-of-Zhentu" class="common-anchor-header">Uma visão geral do Zhentu<button data-href="#An-overview-of-Zhentu" class="anchor-icon" translate="no">
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
    </button></h2><p>O Zhentu é o produto de controlo de risco visual multimédia concebido pela BestPay, profundamente integrado com tecnologias de aprendizagem automática (ML) e de reconhecimento de imagem de rede neural. O seu algoritmo integrado pode identificar com precisão os autores de fraudes durante a autenticação do utilizador e responder ao nível dos milissegundos. Com a sua tecnologia líder na indústria e solução inovadora, a Zhentu ganhou cinco patentes e dois direitos de autor de software. Atualmente, está a ser utilizado em vários bancos e instituições financeiras para ajudar a identificar antecipadamente potenciais riscos.</p>
<h2 id="System-structure" class="common-anchor-header">Estrutura do sistema<button data-href="#System-structure" class="anchor-icon" translate="no">
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
    </button></h2><p>Atualmente, a BestPay tem mais de 10 milhões de fotografias de licenças comerciais e o volume real continua a aumentar exponencialmente à medida que a empresa cresce. Para recuperar rapidamente fotografias semelhantes de uma base de dados tão grande, a Zhentu escolheu o Milvus como motor de cálculo de semelhança de vectores de caraterísticas. A estrutura geral do sistema de deteção de fraudes fotográficas é apresentada no diagrama abaixo.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Structure_of_the_photo_fraud_detection_system_cf5d20d431.png" alt="img" class="doc-image" id="img" />
   </span> <span class="img-wrapper"> <span>img</span> </span></p>
<p>O procedimento pode ser dividido em quatro etapas:</p>
<ol>
<li><p>Pré-processamento da imagem. O pré-processamento, que inclui a redução do ruído, a remoção do ruído e o melhoramento do contraste, assegura a integridade da informação original e a remoção de informação inútil do sinal de imagem.</p></li>
<li><p>Extração do vetor de caraterísticas. Um modelo de aprendizagem profunda especialmente treinado é utilizado para extrair os vectores de caraterísticas da imagem. A conversão de imagens em vectores para posterior pesquisa de semelhanças é uma operação de rotina.</p></li>
<li><p>Normalização. A normalização dos vectores de caraterísticas extraídos ajuda a melhorar a eficiência do processamento subsequente.</p></li>
<li><p>Pesquisa de vectores com Milvus. Inserção dos vectores normalizados na base de dados Milvus para pesquisa de semelhanças vectoriais.</p></li>
</ol>
<h2 id="Deployment" class="common-anchor-header"><strong>Implementação</strong><button data-href="#Deployment" class="anchor-icon" translate="no">
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
    </button></h2><p>Segue-se uma breve descrição de como o sistema de deteção de fraudes fotográficas da Zhentu é implementado.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/milvus_architecture_ea45a5ab53.png" alt="Milvus system architecture" class="doc-image" id="milvus-system-architecture" />
   </span> <span class="img-wrapper"> <span>Arquitetura do sistema Milvus</span> </span></p>
<p>Implementámos o nosso <a href="https://milvus.io/docs/v2.0.x/install_cluster-helm.md">cluster Milvus em Kubernetes</a> para garantir uma elevada disponibilidade e sincronização em tempo real dos serviços na nuvem. Os passos gerais são os seguintes:</p>
<ol>
<li><p>Ver os recursos disponíveis. Execute o comando <code translate="no">kubectl describe nodes</code> para ver os recursos que o cluster do Kubernetes pode alocar para os casos criados.</p></li>
<li><p>Alocar recursos. Execute o comando <code translate="no">kubect`` -- apply xxx.yaml</code> para alocar recursos de memória e CPU para os componentes do cluster Milvus usando o Helm.</p></li>
<li><p>Aplicar a nova configuração. Execute o comando <code translate="no">helm upgrade my-release milvus/milvus --reuse-values -fresources.yaml</code>.</p></li>
<li><p>Aplique a nova configuração ao cluster do Milvus. O cluster implementado desta forma não só nos permite ajustar a capacidade do sistema de acordo com as diferentes necessidades comerciais, como também satisfaz melhor os requisitos de elevado desempenho para a recuperação massiva de dados vectoriais.</p></li>
</ol>
<p>É possível <a href="https://milvus.io/docs/v2.0.x/configure-docker.md">configurar o Milvus</a> para otimizar o desempenho da pesquisa para diferentes tipos de dados de diferentes cenários empresariais, como se mostra nos dois exemplos seguintes.</p>
<p>Na <a href="https://milvus.io/docs/v2.0.x/build_index.md">construção do índice vetorial</a>, parametrizamos o índice de acordo com o cenário real do sistema, como se segue:</p>
<pre><code translate="no" class="language-Python">index = {<span class="hljs-string">&quot;index_type&quot;</span>: <span class="hljs-string">&quot;IVF_PQ&quot;</span>, <span class="hljs-string">&quot;params&quot;</span>: {<span class="hljs-string">&quot;nlist&quot;</span>: <span class="hljs-number">2048</span>}, <span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;IP&quot;</span>}
<button class="copy-code-btn"></button></code></pre>
<p><a href="https://milvus.io/docs/v2.0.x/index.md#IVF_PQ">O IVF_PQ</a> efectua o agrupamento do índice IVF antes de quantificar o produto de vectores. Apresenta uma consulta de disco de alta velocidade e um consumo de memória muito baixo, o que satisfaz as necessidades da aplicação real do Zhentu.</p>
<p>Além disso, definimos os parâmetros de pesquisa óptimos da seguinte forma:</p>
<pre><code translate="no" class="language-Python">search_params = {<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;IP&quot;</span>, <span class="hljs-string">&quot;params&quot;</span>: {<span class="hljs-string">&quot;nprobe&quot;</span>: <span class="hljs-number">32</span>}}
<button class="copy-code-btn"></button></code></pre>
<p>Como os vectores já estão normalizados antes de serem introduzidos no Milvus, o produto interno (PI) é escolhido para calcular a distância entre dois vectores. As experiências provaram que a taxa de recuperação é aumentada em cerca de 15% utilizando o PI do que utilizando a distância euclidiana (L2).</p>
<p>Os exemplos acima mostram que podemos testar e definir os parâmetros do Milvus de acordo com diferentes cenários empresariais e requisitos de desempenho.</p>
<p>Para além disso, Milvus não só integra diferentes bibliotecas de índices, como também suporta diferentes tipos de índices e métodos de cálculo de similaridade. O Milvus também fornece SDKs oficiais em vários idiomas e APIs ricas para inserção, consulta, etc., permitindo que os nossos grupos comerciais de front-end utilizem os SDKs para chamar o centro de controlo de riscos.</p>
<h2 id="Real-world-performance" class="common-anchor-header"><strong>Desempenho no mundo real</strong><button data-href="#Real-world-performance" class="anchor-icon" translate="no">
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
    </button></h2><p>Até agora, o sistema de deteção de fraudes com fotografias tem funcionado de forma constante, ajudando as empresas a identificar potenciais autores de fraudes. Em 2021, detetou mais de 20 000 licenças falsas ao longo do ano. Em termos de velocidade de consulta, uma única consulta de vetor entre dezenas de milhões de vetores leva menos de 1 segundo, e o tempo médio de consulta em lote é inferior a 0,08 segundos. A pesquisa de alto desempenho do Milvus satisfaz as necessidades das empresas em termos de precisão e simultaneidade.</p>
<h2 id="Reference" class="common-anchor-header"><strong>Referências</strong><button data-href="#Reference" class="anchor-icon" translate="no">
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
    </button></h2><p>Aglave P, Kolkure V S. Implementação de um método de extração de caraterísticas de elevado desempenho utilizando o algoritmo de resumo orientado rápido e rodado [J]. Int. J. Res. Eng. Technol, 2015, 4: 394-397.</p>
<h2 id="About-BestPay" class="common-anchor-header"><strong>Sobre a BestPay</strong><button data-href="#About-BestPay" class="anchor-icon" translate="no">
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
    </button></h2><p>A China Telecom BestPay Co., Ltd é uma subsidiária integral da China Telecom. Opera os negócios de pagamento e finanças. A BestPay está empenhada em utilizar tecnologias de ponta, como big data, inteligência artificial e computação em nuvem, para potenciar a inovação empresarial, fornecendo produtos inteligentes, soluções de controlo de risco e outros serviços. Até janeiro de 2016, a aplicação denominada BestPay atraiu mais de 200 milhões de utilizadores e tornou-se o terceiro maior operador de plataformas de pagamento na China, seguindo de perto a Alipay e a WeChat Payment.</p>
