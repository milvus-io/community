---
id: >-
  efficient-vector-similarity-search-recommender-workflows-using-milvus-nvidia-merlin.md
title: >-
  Pesquisa eficiente de similaridade de vetores em fluxos de trabalho de
  recomendação usando Milvus com NVIDIA Merlin
author: Burcin Bozkaya
date: 2023-12-15T00:00:00.000Z
desc: >-
  Uma introdução à integração do NVIDIA Merlin e do Milvus na criação de
  sistemas de recomendação e na avaliação comparativa do seu desempenho em
  vários cenários.
cover: assets.zilliz.com/nvidia_4921837ca6.png
tag: Engineering
tags: >-
  Milvus, Vector Database, Open Source, Data science, Artificial Intelligence,
  Vector Management, NVIDIA, Merlin
recommend: true
canonicalUrl: >-
  https://zilliz.com/blog/efficient-vector-similarity-search-recommender-workflows-using-milvus-nvidia-merlin
---
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/nvidia_4921837ca6.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>Este post foi publicado pela primeira vez no <a href="https://medium.com/nvidia-merlin/efficient-vector-similarity-search-in-recommender-workflows-using-milvus-with-nvidia-merlin-84d568290ee4">canal NVIDIA Merlin's Medium</a> e editado e republicado aqui com permissão. Foi escrito em conjunto por <a href="https://medium.com/u/743df9db1666?source=post_page-----84d568290ee4--------------------------------">Burcin Bozkaya</a> e <a href="https://medium.com/u/279d4c25a145?source=post_page-----84d568290ee4--------------------------------">William Hicks</a> da NVIDIA e <a href="https://medium.com/u/3e8a3c67a8a5?source=post_page-----84d568290ee4--------------------------------">Filip Haltmayer</a> e <a href="https://github.com/liliu-z">Li Liu</a> da Zilliz.</em></p>
<h2 id="Introduction" class="common-anchor-header">Introdução<button data-href="#Introduction" class="anchor-icon" translate="no">
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
    </button></h2><p>Os sistemas de recomendação modernos (Recsys) consistem em pipelines de formação/inferência que envolvem várias fases de ingestão de dados, pré-processamento de dados, formação de modelos e ajuste de hiperparâmetros para recuperação, filtragem, classificação e pontuação de itens relevantes. Um componente essencial de um sistema de recomendação é a recuperação ou descoberta dos elementos mais relevantes para um utilizador, especialmente na presença de grandes catálogos de itens. Este passo envolve normalmente uma pesquisa <a href="https://zilliz.com/glossary/anns">aproximada do vizinho mais próximo (ANN)</a> numa base de dados indexada de representações vectoriais de baixa dimensão (ou seja, embeddings) de atributos de produtos e utilizadores criados a partir de modelos de aprendizagem profunda que treinam em interações entre utilizadores e produtos/serviços.</p>
<p><a href="https://github.com/NVIDIA-Merlin">O NVIDIA Merlin</a>, uma estrutura de código aberto desenvolvida para treinar modelos de ponta a ponta para fazer recomendações em qualquer escala, integra-se com um índice <a href="https://zilliz.com/learn/what-is-vector-database">de base de dados vetorial</a> eficiente e uma estrutura de pesquisa. Uma dessas estruturas que ganhou muita atenção recentemente é a <a href="https://zilliz.com/what-is-milvus">Milvus</a>, uma base de dados vetorial de código aberto criada pela <a href="https://zilliz.com/">Zilliz</a>. Ela oferece recursos rápidos de índice e consulta. O Milvus recentemente adicionou <a href="https://zilliz.com/blog/getting-started-with-gpu-powered-milvus-unlocking-10x-higher-performance">suporte à aceleração de GPU</a> que usa GPUs NVIDIA para sustentar fluxos de trabalho de IA. O suporte à aceleração de GPU é uma ótima notícia porque uma biblioteca de pesquisa vetorial acelerada possibilita consultas simultâneas rápidas, impactando positivamente os requisitos de latência nos sistemas de recomendação atuais, onde os desenvolvedores esperam muitas solicitações simultâneas. Milvus tem mais de 5M docker pulls, ~23k estrelas no GitHub (em setembro de 2023), mais de 5.000 clientes corporativos e um componente central de muitos aplicativos (veja <a href="https://medium.com/vector-database/tagged/use-cases-of-milvus">casos de</a> uso).</p>
<p>Este blogue demonstra como o Milvus funciona com a estrutura Merlin Recsys no momento da formação e da inferência. Mostramos como o Milvus complementa o Merlin na fase de recuperação de itens com uma pesquisa de incorporação de vetor top-k altamente eficiente e como pode ser utilizado com o Servidor de Inferência NVIDIA Triton (TIS) no momento da inferência (ver Figura 1). <strong>Os nossos resultados de referência mostram uma impressionante aceleração de 37x a 91x com o Milvus acelerado por GPU que utiliza o NVIDIA RAFT com as incorporações vectoriais geradas pelos Modelos Merlin.</strong> O código que usamos para mostrar a integração Merlin-Milvus e os resultados detalhados do benchmark, juntamente com a <a href="https://github.com/zilliztech/VectorDBBench">biblioteca</a> que facilitou o nosso estudo de benchmark, estão disponíveis aqui.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Multistage_recommender_system_with_Milvus_ee891c4ad5.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>Figura 1. Sistema de recomendação de múltiplos estágios com o framework Milvus contribuindo para o estágio de recuperação. Fonte da figura original de vários estágios: este <a href="https://medium.com/nvidia-merlin/recommender-systems-not-just-recommender-models-485c161c755e">post do blogue</a>.</em></p>
<h2 id="The-challenges-facing-recommenders" class="common-anchor-header">Os desafios que os sistemas de recomendação enfrentam<button data-href="#The-challenges-facing-recommenders" class="anchor-icon" translate="no">
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
    </button></h2><p>Dada a natureza multiestágio dos sistemas de recomendação e a disponibilidade de vários componentes e bibliotecas por eles integrados, um desafio significativo é a integração de todos os componentes num pipeline de ponta a ponta. O nosso objetivo é mostrar que a integração pode ser feita com menos esforço nos nossos cadernos de exemplo.</p>
<p>Outro desafio dos fluxos de trabalho de recomendação é a aceleração de certas partes do pipeline. Embora se saiba que desempenham um papel importante no treino de grandes redes neuronais, as GPU são apenas adições recentes às bases de dados vectoriais e à pesquisa de RNA. Com o aumento da dimensão dos inventários de produtos de comércio eletrónico ou das bases de dados de multimédia em fluxo contínuo e o número de utilizadores que utilizam estes serviços, as CPUs têm de fornecer o desempenho necessário para servir milhões de utilizadores em fluxos de trabalho Recsys eficientes. A aceleração de GPU noutras partes do pipeline tornou-se necessária para responder a este desafio. A solução deste blogue aborda este desafio, mostrando que a pesquisa ANN é eficiente quando se utilizam GPUs.</p>
<h2 id="Tech-stacks-for-the-solution" class="common-anchor-header">Pilhas de tecnologia para a solução<button data-href="#Tech-stacks-for-the-solution" class="anchor-icon" translate="no">
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
    </button></h2><p>Vamos começar por rever alguns dos fundamentos necessários para realizar o nosso trabalho.</p>
<ul>
<li><p>NVIDIA <a href="https://github.com/NVIDIA-Merlin/Merlin">Merlin</a>: uma biblioteca de código aberto com APIs de alto nível que aceleram os recomendadores nas GPUs NVIDIA.</p></li>
<li><p><a href="https://github.com/NVIDIA-Merlin/NVTabular">NVTabular</a>: para pré-processamento dos dados tabulares de entrada e engenharia de recursos.</p></li>
<li><p><a href="https://github.com/NVIDIA-Merlin/models">Modelos Merlin</a>: para treinar modelos de aprendizagem profunda e para aprender, neste caso, vectores de incorporação de utilizadores e itens a partir de dados de interação do utilizador.</p></li>
<li><p><a href="https://github.com/NVIDIA-Merlin/systems">Sistemas Merlin</a>: para combinar um modelo de recomendação baseado em TensorFlow com outros elementos (por exemplo, armazenamento de recursos, pesquisa ANN com Milvus) a serem servidos com o TIS.</p></li>
<li><p><a href="https://github.com/triton-inference-server/server">Triton Inference Server</a>: para a fase de inferência em que é passado um vetor de caraterísticas do utilizador e são geradas recomendações de produtos.</p></li>
<li><p>Containerização: todos os itens acima estão disponíveis por meio de container(s) que a NVIDIA fornece no <a href="https://catalog.ngc.nvidia.com/">catálogo NGC</a>. Utilizámos o contentor Merlin TensorFlow 23.06 disponível <a href="https://catalog.ngc.nvidia.com/orgs/nvidia/teams/merlin/containers/merlin-tensorflow">aqui</a>.</p></li>
<li><p><a href="https://github.com/milvus-io/milvus/releases/tag/v2.3.0">Milvus 2.3</a>: para realizar indexação e consulta de vetores acelerados por GPU.</p></li>
<li><p><a href="https://github.com/milvus-io/milvus/releases">Milvus 2.2.11</a>: o mesmo que acima, mas para fazer isso na CPU.</p></li>
<li><p><a href="https://zilliz.com/product/integrations/python">Pymilvus SDK</a>: para se conectar ao servidor Milvus, criar índices de banco de dados vetoriais e executar consultas por meio de uma interface Python.</p></li>
<li><p><a href="https://github.com/feast-dev/feast">Feast</a>: para guardar e recuperar atributos de utilizadores e itens num feature store (de código aberto) como parte do nosso pipeline RecSys de ponta a ponta.</p></li>
</ul>
<p>Várias bibliotecas e frameworks subjacentes também são usadas nos bastidores. Por exemplo, o Merlin depende de outras bibliotecas da NVIDIA, como cuDF e Dask, ambas disponíveis no <a href="https://github.com/rapidsai/cudf">RAPIDS cuDF</a>. Da mesma forma, o Milvus baseia-se no <a href="https://github.com/rapidsai/raft">NVIDIA RAFT</a> para primitivas sobre aceleração de GPU e bibliotecas modificadas, como <a href="https://zilliz.com/learn/hierarchical-navigable-small-worlds-HNSW">HNSW</a> e <a href="https://zilliz.com/blog/set-up-with-facebook-ai-similarity-search-faiss">FAISS</a>, para pesquisa.</p>
<h2 id="Understanding-vector-databases-and-Milvus" class="common-anchor-header">Compreender as bases de dados vectoriais e o Milvus<button data-href="#Understanding-vector-databases-and-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://zilliz.com/glossary/anns">O vizinho mais próximo aproximado (ANN)</a> é uma funcionalidade que as bases de dados relacionais não conseguem suportar. As bases de dados relacionais foram concebidas para tratar dados tabulares com estruturas predefinidas e valores diretamente comparáveis. Os índices das bases de dados relacionais baseiam-se nisto para comparar dados e criar estruturas que tiram partido do facto de se saber se cada valor é inferior ou superior ao outro. Os vectores de incorporação não podem ser diretamente comparados uns com os outros desta forma, uma vez que é necessário saber o que cada valor do vetor representa. Não se pode dizer se um vetor é necessariamente menor do que o outro. A única coisa que podemos fazer é calcular a distância entre os dois vectores. Se a distância entre dois vectores for pequena, podemos assumir que as caraterísticas que representam são semelhantes, e se for grande, podemos assumir que os dados que representam são mais diferentes. No entanto, estes índices eficientes têm um custo; o cálculo da distância entre dois vectores é computacionalmente dispendioso e os índices vectoriais não são facilmente adaptáveis e, por vezes, não são modificáveis. Devido a estas duas limitações, a integração destes índices é mais complexa nas bases de dados relacionais, razão pela qual são necessárias <a href="https://zilliz.com/blog/what-is-a-real-vector-database">bases de dados vectoriais específicas</a>.</p>
<p><a href="https://zilliz.com/what-is-milvus">O Milvus</a> foi criado para resolver os problemas que as bases de dados relacionais enfrentam com os vectores e foi concebido desde o início para lidar com estes vectores de incorporação e os seus índices em grande escala. Para cumprir o distintivo nativo da nuvem, o Milvus separa a computação e o armazenamento e as diferentes tarefas de computação - consulta, tratamento de dados e indexação. Os utilizadores podem escalar cada parte da base de dados para lidar com outros casos de utilização, quer sejam de inserção de dados ou de pesquisa. Se houver um grande afluxo de pedidos de inserção, o utilizador pode dimensionar temporariamente os nós de índice horizontal e verticalmente para lidar com a ingestão. Da mesma forma, se não estiverem a ser ingeridos dados, mas houver muitas pesquisas, o utilizador pode reduzir os nós de índice e, em vez disso, aumentar os nós de consulta para obter mais rendimento. Este design do sistema (ver Figura 2) exigiu que pensássemos numa mentalidade de computação paralela, resultando num sistema optimizado para computação com muitas portas abertas para mais optimizações.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Milvus_system_design_bb3a44c9cc.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>Figura 2. Projeto do sistema Milvus</em></p>
<p>O Milvus também utiliza muitas bibliotecas de indexação de última geração para dar aos utilizadores o máximo de personalização possível para o seu sistema. Melhora-as adicionando a capacidade de lidar com operações CRUD, dados em fluxo contínuo e filtragem. Mais adiante, discutiremos como esses índices diferem e quais são os prós e contras de cada um.</p>
<h2 id="Example-solution-integration-of-Milvus-and-Merlin" class="common-anchor-header">Solução de exemplo: integração do Milvus e do Merlin<button data-href="#Example-solution-integration-of-Milvus-and-Merlin" class="anchor-icon" translate="no">
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
    </button></h2><p>A solução de exemplo que apresentamos aqui demonstra a integração do Milvus com o Merlin na fase de recuperação de itens (quando os k itens mais relevantes são recuperados através de uma pesquisa ANN). Utilizamos um conjunto de dados reais de um <a href="https://www.kaggle.com/datasets/chadgostopp/recsys-challenge-2015">desafio RecSys</a>, descrito abaixo. Treinamos um modelo de aprendizagem profunda Two-Tower que aprende as incorporações vectoriais para utilizadores e itens. Esta secção também fornece o plano do nosso trabalho de avaliação comparativa, incluindo as métricas que recolhemos e a gama de parâmetros que utilizamos.</p>
<p>A nossa abordagem envolve:</p>
<ul>
<li><p>Ingestão e pré-processamento de dados</p></li>
<li><p>Treino do modelo de aprendizagem profunda Two-Tower</p></li>
<li><p>Construção do índice Milvus</p></li>
<li><p>Pesquisa de semelhanças Milvus</p></li>
</ul>
<p>Descrevemos brevemente cada passo e remetemos o leitor para os nossos <a href="https://github.com/bbozkaya/merlin-milvus/tree/main/notebooks">notebooks</a> para mais pormenores.</p>
<h3 id="Dataset" class="common-anchor-header">Conjunto de dados</h3><p>A YOOCHOOSE GmbH fornece o conjunto de dados que utilizamos nesta integração e estudo de referência para o <a href="https://www.kaggle.com/datasets/chadgostopp/recsys-challenge-2015">desafio RecSys 2015</a> e está disponível no Kaggle. Contém eventos de clique/compra do utilizador de um retalhista europeu online com atributos como um ID de sessão, registo de data e hora, ID do item associado ao clique/compra e categoria do item, disponíveis no ficheiro yoochoose-clicks.dat. As sessões são independentes e não há indícios de utilizadores que regressam, pelo que tratamos cada sessão como pertencente a um utilizador distinto. O conjunto de dados tem 9.249.729 sessões únicas (utilizadores) e 52.739 itens únicos.</p>
<h3 id="Data-ingestion-and-preprocessing" class="common-anchor-header">Ingestão e pré-processamento de dados</h3><p>A ferramenta que utilizamos para o pré-processamento de dados é o <a href="https://github.com/NVIDIA-Merlin/NVTabular">NVTabular</a>, um componente de engenharia de caraterísticas e pré-processamento do Merlin acelerado por GPU e altamente escalável. Utilizamos o NVTabular para ler os dados na memória da GPU, reorganizar as caraterísticas conforme necessário, exportar para ficheiros parquet e criar uma divisão de validação de treino para treino. Isto resulta em 7.305.761 utilizadores únicos e 49.008 itens únicos para treinar. Também categorizamos cada coluna e seus valores em valores inteiros. O conjunto de dados está agora pronto para ser treinado com o modelo Two-Tower.</p>
<h3 id="Model-training" class="common-anchor-header">Treinamento do modelo</h3><p>Utilizamos o modelo de aprendizagem profunda <a href="https://github.com/NVIDIA-Merlin/models/blob/main/examples/05-Retrieval-Model.ipynb">Two-Tower</a> para treinar e gerar embeddings de utilizadores e itens, posteriormente utilizados na indexação e consulta de vectores. Depois de treinar o modelo, podemos extrair as incorporações de utilizador e item aprendidas.</p>
<p>Os dois passos seguintes são opcionais: um modelo <a href="https://arxiv.org/abs/1906.00091">DLRM</a> treinado para classificar os itens recuperados para recomendação e um armazenamento de caraterísticas utilizado (neste caso, <a href="https://github.com/feast-dev/feast">Feast</a>) para armazenar e recuperar caraterísticas de utilizadores e itens. Incluímo-las para completar o fluxo de trabalho em várias fases.</p>
<p>Por fim, exportamos os embeddings do utilizador e do item para ficheiros parquet, que podem mais tarde ser recarregados para criar um índice vetorial Milvus.</p>
<h3 id="Building-and-querying-the-Milvus-index" class="common-anchor-header">Construção e consulta do índice Milvus</h3><p>O Milvus facilita a indexação de vectores e a pesquisa de semelhanças através de um "servidor" lançado na máquina de inferência. No nosso bloco de notas n.º 2, configuramo-lo através da instalação do servidor Milvus e do Pymilvus, iniciando depois o servidor com a sua porta de escuta predefinida. De seguida, demonstramos a construção de um índice simples (IVF_FLAT) e a consulta do mesmo utilizando as funções <code translate="no">setup_milvus</code> e <code translate="no">query_milvus</code>, respetivamente.</p>
<h2 id="Benchmarking" class="common-anchor-header">Testes de referência<button data-href="#Benchmarking" class="anchor-icon" translate="no">
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
    </button></h2><p>Concebemos dois benchmarks para demonstrar a necessidade de utilizar uma biblioteca de indexação/pesquisa vetorial rápida e eficiente como o Milvus.</p>
<ol>
<li><p>Usando o Milvus para construir índices vectoriais com os dois conjuntos de embeddings que gerámos: 1) embeddings de utilizadores para 7,3 milhões de utilizadores únicos, divididos em 85% de conjunto de treino (para indexação) e 15% de conjunto de teste (para consulta), e 2) embeddings de itens para 49 mil produtos (com uma divisão de 50-50 entre treino e teste). Este teste de referência é feito independentemente para cada conjunto de dados vectoriais e os resultados são apresentados separadamente.</p></li>
<li><p>Utilizando o Milvus para construir um índice de vectores para o conjunto de dados de 49K itens incorporados e consultando os 7,3 milhões de utilizadores únicos em relação a este índice para pesquisa de semelhanças.</p></li>
</ol>
<p>Nesses benchmarks, usamos os algoritmos de indexação IVFPQ e HNSW executados em GPU e CPU, juntamente com várias combinações de parâmetros. Os detalhes estão disponíveis <a href="https://github.com/bbozkaya/merlin-milvus/tree/main/results">aqui</a>.</p>
<p>O compromisso entre a qualidade da pesquisa e o rendimento é uma consideração importante de desempenho, especialmente num ambiente de produção. O Milvus permite um controlo total sobre os parâmetros de indexação para explorar esta relação para um determinado caso de utilização, de modo a obter melhores resultados de pesquisa com a verdade fundamental. Isto pode significar um aumento do custo computacional sob a forma de uma taxa de transferência reduzida ou de consultas por segundo (QPS). Medimos a qualidade da pesquisa ANN com uma métrica de recuperação e fornecemos curvas QPS-recall que demonstram o compromisso. Pode então decidir-se sobre um nível aceitável de qualidade de pesquisa, tendo em conta os recursos de computação ou os requisitos de latência/rendimento do caso de negócio.</p>
<p>Além disso, observe o tamanho do lote de consulta (nq) usado em nossos benchmarks. Isto é útil em fluxos de trabalho em que são enviados vários pedidos simultâneos para inferência (por exemplo, recomendações offline solicitadas e enviadas para uma lista de destinatários de correio eletrónico ou recomendações online criadas por agrupamento de pedidos simultâneos que chegam e são processados de uma só vez). Dependendo do caso de utilização, o TIS também pode ajudar a processar estes pedidos em lotes.</p>
<h3 id="Results" class="common-anchor-header">Resultados</h3><p>Relatamos agora os resultados para os três conjuntos de benchmarks em CPU e GPU, usando os tipos de índice HNSW (somente CPU) e IVF_PQ (CPU e GPU) implementados pelo Milvus.</p>
<h4 id="Items-vs-Items-vector-similarity-search" class="common-anchor-header">Pesquisa de similaridade vetorial Items vs. Items</h4><p>Com este conjunto de dados mais pequeno, cada execução para uma determinada combinação de parâmetros utiliza 50% dos vectores de itens como vectores de consulta e consulta os 100 principais vectores semelhantes dos restantes. O HNSW e o IVF_PQ produzem uma elevada recuperação com as definições de parâmetros testadas, no intervalo 0,958-1,0 e 0,665-0,997, respetivamente. Este resultado sugere que o HNSW tem um melhor desempenho no que diz respeito à recuperação, mas o IVF_PQ com definições de nlist pequenas produz uma recuperação muito comparável. Também devemos notar que os valores de recuperação podem variar muito, dependendo dos parâmetros de indexação e consulta. Os valores que reportamos foram obtidos após uma experimentação preliminar com intervalos de parâmetros gerais e uma análise mais aprofundada de um subconjunto selecionado.</p>
<p>O tempo total para executar todas as consultas na CPU com HNSW para uma determinada combinação de parâmetros varia entre 5,22 e 5,33 s (mais rápido à medida que m aumenta, relativamente inalterado com ef) e com IVF_PQ entre 13,67 e 14,67 s (mais lento à medida que nlist e nprobe aumentam). A aceleração da GPU tem de facto um efeito notável, como se pode ver na Figura 3.</p>
<p>A Figura 3 mostra a troca entre a recuperação e a taxa de transferência em todas as execuções concluídas na CPU e na GPU com este pequeno conjunto de dados usando IVF_PQ. Verificamos que a GPU fornece um aumento de velocidade de 4x a 15x em todas as combinações de parâmetros testadas (maior aumento de velocidade à medida que o nprobe aumenta). Isto é calculado tomando o rácio de QPS de GPU sobre QPS de execuções de CPU para cada combinação de parâmetros. De um modo geral, este conjunto apresenta um pequeno desafio para a CPU ou GPU e mostra perspectivas de aumento de velocidade com os conjuntos de dados maiores, conforme discutido abaixo.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/GPU_speedup_with_Milvus_IVF_PQ_item_item_d32de8443d.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>Figura 3. Aumento de velocidade da GPU com o algoritmo Milvus IVF_PQ em execução na GPU NVIDIA A100 (pesquisa de similaridade item-item)</em></p>
<h4 id="Users-vs-Users-vector-similarity-search" class="common-anchor-header">Pesquisa de semelhança vetorial Utilizadores vs. Utilizadores</h4><p>Com o segundo conjunto de dados muito maior (7,3 milhões de utilizadores), reservámos 85% (~6,2 milhões) dos vectores como "treino" (o conjunto de vectores a indexar) e os restantes 15% (~1,1 milhões) como "teste" ou conjunto de vectores de consulta. O HNSW e o IVF_PQ têm um desempenho excecional neste caso, com valores de recuperação de 0,884-1,0 e 0,922-0,999, respetivamente. No entanto, são computacionalmente muito mais exigentes, especialmente com IVF_PQ na CPU. O tempo total para executar todas as consultas na CPU com o HNSW varia entre 279,89 e 295,56 s e com o IVF_PQ entre 3082,67 e 10932,33 s. Note-se que estes tempos de consulta são cumulativos para 1,1 milhões de vectores consultados, pelo que se pode dizer que uma única consulta ao índice continua a ser muito rápida.</p>
<p>No entanto, a consulta baseada em CPU pode não ser viável se o servidor de inferência esperar muitos milhares de solicitações simultâneas para executar consultas em um inventário de milhões de itens.</p>
<p>A GPU A100 oferece uma velocidade incrível de 37x a 91x (média de 76,1x) em todas as combinações de parâmetros com IVF_PQ em termos de taxa de transferência (QPS), mostrada na Figura 4. Isto é consistente com o que observámos com o pequeno conjunto de dados, o que sugere que o desempenho da GPU é razoavelmente bem dimensionado utilizando o Milvus com milhões de vectores de incorporação.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/GPU_speedup_with_Milvus_IVF_PQ_algorithm_user_user_c91f4e4164.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>Figura 4. Aumento da velocidade da GPU com o algoritmo Milvus IVF_PQ em execução na GPU NVIDIA A100 (pesquisa de semelhança utilizador-utilizador)</em></p>
<p>A Figura 5 detalhada a seguir mostra a troca de QPS de recuperação para todas as combinações de parâmetros testadas em CPU e GPU com IVF_PQ. Cada conjunto de pontos (superior para GPU, inferior para CPU) neste gráfico representa a troca enfrentada ao alterar os parâmetros de indexação/consulta de vectores para obter uma maior recuperação à custa de um menor rendimento. Note-se a perda considerável de QPS no caso da GPU quando se tenta atingir níveis de recuperação mais elevados.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Recall_Throughput_tradeoff_519b2289e5.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>Figura 5. Troca entre taxa de recuperação e taxa de transferência para todas as combinações de parâmetros testadas em CPU e GPU com IVF_PQ (utilizadores vs. utilizadores)</em></p>
<h4 id="Users-vs-Items-vector-similarity-search" class="common-anchor-header">Utilizadores vs. Itens pesquisa de semelhança de vectores</h4><p>Finalmente, consideramos outro caso de utilização realista em que os vectores de utilizadores são consultados em relação a vectores de itens (como demonstrado no Notebook 01 acima). Neste caso, 49 mil vectores de itens são indexados e 7,3 milhões de vectores de utilizadores são consultados para obter os 100 itens mais semelhantes.</p>
<p>É aqui que as coisas ficam interessantes, pois a consulta de 7,3 milhões em lotes de 1.000 em um índice de 49 mil itens parece consumir muito tempo na CPU, tanto para o HNSW quanto para o IVF_PQ. A GPU parece lidar melhor com este caso (ver Figura 6). Os níveis de precisão mais elevados do IVF_PQ na CPU quando nlist = 100 são calculados em cerca de 86 minutos, em média, mas variam significativamente à medida que o valor de nprobe aumenta (51 min. quando nprobe = 5 vs. 128 min. quando nprobe = 20). A GPU NVIDIA A100 acelera consideravelmente o desempenho por um fator de 4x a 17x (acelerações mais elevadas à medida que nprobe aumenta). Recorde-se que o algoritmo IVF_PQ, através da sua técnica de quantização, também reduz o espaço de memória e fornece uma solução de pesquisa ANN computacionalmente viável combinada com a aceleração da GPU.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/GPU_speedup_with_Milvus_IVF_PQ_algorithm_user_item_504462fcc0.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>Figura 6. Aceleração da GPU com o algoritmo Milvus IVF_PQ em execução na GPU NVIDIA A100 (pesquisa de semelhança entre itens de utilizador)</em></p>
<p>Semelhante à Figura 5, o compromisso entre recuperação e taxa de transferência é mostrado na Figura 7 para todas as combinações de parâmetros testadas com IVF_PQ. Aqui, ainda é possível ver como pode ser necessário abrir mão de alguma precisão na pesquisa ANN em favor do aumento da taxa de transferência, embora as diferenças sejam muito menos perceptíveis, especialmente no caso de execuções de GPU. Isto sugere que se pode esperar níveis relativamente elevados e consistentes de desempenho computacional com a GPU, ao mesmo tempo que se obtém uma elevada recuperação.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Recall_Throughput_tradeoff_user_items_0abce91c5e.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>Figura 7. Troca entre a recuperação e a taxa de transferência para todas as combinações de parâmetros testadas na CPU e na GPU com IVF_PQ (utilizadores vs. itens)</em></p>
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
    </button></h2><p>Teremos todo o gosto em partilhar algumas observações finais se chegou até aqui. Queremos lembrar que a complexidade e a natureza de várias etapas do Recsys moderno exigem desempenho e eficiência em cada etapa. Esperamos que este blogue lhe tenha dado razões convincentes para considerar a utilização de duas funcionalidades críticas nos seus pipelines RecSys:</p>
<ul>
<li><p>A biblioteca Merlin Systems da NVIDIA Merlin permite-lhe ligar facilmente o <a href="https://github.com/milvus-io/milvus/tree/2.3.0">Milvus</a>, um eficiente motor de pesquisa de vectores acelerado por GPU.</p></li>
<li><p>Utilize a GPU para acelerar os cálculos para a indexação de bases de dados vectoriais e a pesquisa ANN com tecnologia como o <a href="https://github.com/rapidsai/raft">RAPIDS RAFT</a>.</p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/summary_benchmark_results_ae33fbe514.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Estes resultados sugerem que a integração Merlin-Milvus apresentada tem um elevado desempenho e é muito menos complexa do que outras opções para formação e inferência. Além disso, ambas as estruturas estão a ser ativamente desenvolvidas e muitas das novas funcionalidades (por exemplo, novos índices de bases de dados vectoriais acelerados por GPU por Milvus) são adicionadas em cada versão. O facto de a pesquisa de semelhanças vectoriais ser um componente crucial em vários fluxos de trabalho, como a visão computacional, a modelação de grandes linguagens e os sistemas de recomendação, faz com que este esforço valha ainda mais a pena.</p>
<p>Para terminar, gostaríamos de agradecer a todos os membros das equipas Zilliz/Milvus e Merlin e RAFT que contribuíram para o esforço de produção deste trabalho e da publicação no blogue. Aguardamos o seu contacto, caso tenha oportunidade de implementar o Merlin e o Milvus nos seus recsys ou noutros fluxos de trabalho.</p>
