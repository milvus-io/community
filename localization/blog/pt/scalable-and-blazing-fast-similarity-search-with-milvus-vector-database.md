---
id: scalable-and-blazing-fast-similarity-search-with-milvus-vector-database.md
title: >-
  Pesquisa de semelhanças escalável e extremamente rápida com a base de dados de
  vectores Milvus
author: Dipanjan Sarkar
date: 2022-06-21T00:00:00.000Z
desc: >-
  Armazenar, indexar, gerir e pesquisar triliões de vectores de documentos em
  milissegundos!
cover: assets.zilliz.com/69eba74e_4a9a_4c38_a2d9_2cde283e8a1d_e265515238.png
tag: Engineering
tags: 'Data science, Database, Tech, Artificial Intelligence, Vector Management'
canonicalUrl: >-
  https://milvus.io/blog/scalable_and_blazing_fast_similarity_search_with_milvus_vector_database.md
---
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/69eba74e_4a9a_4c38_a2d9_2cde283e8a1d_e265515238.png" alt="cover image" class="doc-image" id="cover-image" />
   </span> <span class="img-wrapper"> <span>imagem de capa</span> </span></p>
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
    </button></h2><p>Neste artigo, abordaremos alguns aspectos interessantes relacionados com as bases de dados vectoriais e a pesquisa de semelhanças à escala. No mundo atual, em rápida evolução, vemos novas tecnologias, novas empresas, novas fontes de dados e, consequentemente, teremos de continuar a utilizar novas formas de armazenar, gerir e aproveitar estes dados para obter informações. Há décadas que os dados estruturados e tabulares são armazenados em bases de dados relacionais e o Business Intelligence prospera na análise e extração de informações desses dados. No entanto, considerando o panorama atual dos dados, "mais de 80-90% dos dados são informações não estruturadas, como texto, vídeo, áudio, registos de servidores Web, redes sociais e muito mais". As organizações têm aproveitado o poder da aprendizagem automática e da aprendizagem profunda para tentar extrair informações desses dados, uma vez que os métodos tradicionais baseados em consultas podem não ser suficientes ou mesmo possíveis. Existe um enorme potencial inexplorado para extrair informações valiosas desses dados e estamos apenas a começar!</p>
<blockquote>
<p>"Uma vez que a maior parte dos dados do mundo não está estruturada, a capacidade de os analisar e agir sobre eles representa uma grande oportunidade." - Mikey Shulman, Diretor de ML, Kensho</p>
</blockquote>
<p>Os dados não estruturados, como o nome sugere, não têm uma estrutura implícita, como uma tabela de linhas e colunas (por isso são chamados de dados tabulares ou estruturados). Ao contrário dos dados estruturados, não existe uma forma fácil de armazenar o conteúdo dos dados não estruturados numa base de dados relacional. Há três desafios principais na utilização de dados não estruturados para obter informações:</p>
<ul>
<li><strong>Armazenamento:</strong> As bases de dados relacionais normais são boas para armazenar dados estruturados. Embora você possa usar bancos de dados NoSQL para armazenar esses dados, torna-se uma sobrecarga adicional processar esses dados para extrair as representações corretas para alimentar aplicativos de IA em escala</li>
<li><strong>Representação:</strong> Os computadores não entendem texto ou imagens como nós. Só entendem números e precisamos de converter os dados não estruturados numa representação numérica útil, normalmente vectores ou embeddings.</li>
<li><strong>Consulta:</strong> Não é possível consultar dados não estruturados diretamente com base em declarações condicionais definidas, como acontece com a SQL para dados estruturados. Imagine, por exemplo, que está a tentar procurar sapatos semelhantes a partir de uma fotografia do seu par de sapatos preferido! Não pode utilizar valores de pixéis brutos para a pesquisa, nem pode representar caraterísticas estruturadas como a forma, o tamanho, o estilo, a cor e outras. Agora imagine ter de fazer isto para milhões de sapatos!</li>
</ul>
<p>Assim, para que os computadores compreendam, processem e representem dados não estruturados, normalmente convertemo-los em vectores densos, frequentemente designados por "embeddings".</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Representing_Images_as_Dense_Embedding_Vectors_0b6a5f516c.png" alt="figure 1" class="doc-image" id="figure-1" />
   </span> <span class="img-wrapper"> <span>figura 1</span> </span></p>
<p>Existe uma variedade de metodologias que tiram partido da aprendizagem profunda, incluindo as redes neuronais convolucionais (CNN) para dados visuais, como imagens, e os Transformers para dados de texto, que podem ser utilizados para transformar esses dados não estruturados em embeddings. <a href="https://zilliz.com/">Zilliz</a> tem <a href="https://zilliz.com/learn/embedding-generation">um excelente artigo que cobre diferentes técnicas de incorporação</a>!</p>
<p>Agora, armazenar estes vectores de incorporação não é suficiente. Também é necessário poder consultar e encontrar vectores semelhantes. Porque é que pergunta? A maioria das aplicações do mundo real é alimentada pela pesquisa de semelhança de vectores para soluções baseadas em IA. Isto inclui a pesquisa visual (de imagens) no Google, sistemas de recomendações no Netflix ou na Amazon, motores de pesquisa de texto no Google, pesquisa multimodal, desduplicação de dados e muito mais!</p>
<p>Armazenar, gerir e consultar vectores à escala não é uma tarefa simples. Para tal, são necessárias ferramentas especializadas e as bases de dados vectoriais são a ferramenta mais eficaz para o efeito! Neste artigo, abordaremos os seguintes aspectos:</p>
<ul>
<li><a href="#Vectors-and-Vector-Similarity-Search">Vectores e pesquisa de similaridade de vectores</a></li>
<li><a href="#What-is-a-Vector-Database">O que é uma base de dados vetorial?</a></li>
<li><a href="#Milvus—The-World-s-Most-Advanced-Vector-Database">Milvus - A base de dados vetorial mais avançada do mundo</a></li>
<li><a href="#Performing-visual-image-search-with-Milvus—A-use-case-blueprint">Efetuar uma pesquisa visual de imagens com o Milvus - Um esquema de utilização</a></li>
</ul>
<p>Vamos começar!</p>
<h2 id="Vectors-and-Vector-Similarity-Search" class="common-anchor-header">Vectores e pesquisa por semelhança de vectores<button data-href="#Vectors-and-Vector-Similarity-Search" class="anchor-icon" translate="no">
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
    </button></h2><p>Anteriormente, estabelecemos a necessidade de representar dados não estruturados, como imagens e texto, como vectores, uma vez que os computadores só conseguem compreender números. Normalmente, utilizamos modelos de IA, para sermos mais específicos, modelos de aprendizagem profunda para converter dados não estruturados em vectores numéricos que podem ser lidos por máquinas. Normalmente, estes vectores são basicamente uma lista de números de vírgula flutuante que representam coletivamente o item subjacente (imagem, texto, etc.).</p>
<h3 id="Understanding-Vectors" class="common-anchor-header">Compreender os vectores</h3><p>No domínio do processamento de linguagem natural (PNL), temos muitos modelos de incorporação de palavras, como o <a href="https://towardsdatascience.com/understanding-feature-engineering-part-4-deep-learning-methods-for-text-data-96c44370bbfa">Word2Vec, o GloVe e o FastText</a>, que podem ajudar a representar palavras como vectores numéricos. Com os avanços ao longo do tempo, assistimos ao aparecimento de modelos <a href="https://arxiv.org/abs/1706.03762">Transformer</a> como o <a href="https://jalammar.github.io/illustrated-bert/">BERT</a>, que podem ser utilizados para aprender vectores de incorporação contextual e melhores representações de frases e parágrafos inteiros.</p>
<p>Do mesmo modo, no domínio da visão por computador, temos modelos como <a href="https://proceedings.neurips.cc/paper/2012/file/c399862d3b9d6b76c8436e924a68c45b-Paper.pdf">as redes neuronais convolucionais (CNN)</a>, que podem ajudar a aprender representações a partir de dados visuais, como imagens e vídeos. Com o aparecimento dos transformadores, temos também <a href="https://arxiv.org/abs/2010.11929">transformadores de visão</a> que podem ter um desempenho melhor do que as CNN normais.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Sample_workflow_for_extracting_insights_from_unstructured_data_c74f08f75a.png" alt="figure 2" class="doc-image" id="figure-2" />
   </span> <span class="img-wrapper"> <span>figura 2</span> </span></p>
<p>A vantagem destes vectores é que podemos utilizá-los para resolver problemas do mundo real, como a pesquisa visual, em que normalmente se carrega uma fotografia e se obtêm resultados de pesquisa que incluem imagens visualmente semelhantes. O Google tem esta caraterística muito popular no seu motor de busca, como mostra o exemplo seguinte.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/An_example_of_Google_s_Visual_Image_Search_fa49b81e88.png" alt="figure 3" class="doc-image" id="figure-3" />
   </span> <span class="img-wrapper"> <span>figura 3</span> </span></p>
<p>Estas aplicações são alimentadas por vectores de dados e pela pesquisa de semelhanças vectoriais. Se considerarmos dois pontos num espaço de coordenadas cartesianas X-Y. A distância entre dois pontos pode ser calculada como uma distância euclidiana simples, representada pela seguinte equação.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/2_D_Euclidean_Distance_6a52b7bc2f.png" alt="figure 4" class="doc-image" id="figure-4" />
   </span> <span class="img-wrapper"> <span>figura 4</span> </span></p>
<p>Agora, imagine que cada ponto de dados é um vetor com dimensões D. Pode ainda utilizar a distância euclidiana ou mesmo outras métricas de distância, como a distância de hamming ou a distância cosseno, para descobrir a proximidade entre os dois pontos de dados. Isto pode ajudar a construir uma noção de proximidade ou semelhança que pode ser utilizada como uma métrica quantificável para encontrar itens semelhantes, dado um item de referência, utilizando os seus vectores.</p>
<h3 id="Understanding-Vector-Similarity-Search" class="common-anchor-header">Compreender a pesquisa de similaridade vetorial</h3><p>A pesquisa de similaridade vetorial, muitas vezes conhecida como pesquisa do vizinho mais próximo (NN), é basicamente o processo de calcular a similaridade (ou distâncias) entre um item de referência (para o qual queremos encontrar itens semelhantes) e uma coleção de itens existentes (normalmente numa base de dados) e devolver os "k" vizinhos mais próximos que são os "k" itens mais semelhantes. O componente-chave para calcular esta semelhança é a métrica de semelhança, que pode ser a distância euclidiana, o produto interno, a distância cosseno, a distância hamming, etc. Quanto menor for a distância, mais semelhantes são os vectores.</p>
<p>O desafio da pesquisa exacta do vizinho mais próximo (NN) é a escalabilidade. É necessário calcular N distâncias (assumindo N itens existentes) de cada vez para obter itens semelhantes. Isto pode ser muito lento, especialmente se não armazenar e indexar os dados algures (como uma base de dados vetorial!). Para acelerar a computação, normalmente utilizamos a pesquisa aproximada do vizinho mais próximo, frequentemente designada por pesquisa ANN, que acaba por armazenar os vectores num índice. O índice ajuda a armazenar estes vectores de uma forma inteligente para permitir uma recuperação rápida de vizinhos "aproximadamente" semelhantes para um item de consulta de referência. As metodologias típicas de indexação de RNA incluem:</p>
<ul>
<li><strong>Transformações vectoriais:</strong> Inclui a adição de transformações adicionais aos vectores, como a redução da dimensão (por exemplo, PCA \ t-SNE), a rotação, etc.</li>
<li><strong>Codificação de vectores:</strong> Inclui a aplicação de técnicas baseadas em estruturas de dados como Locality Sensitive Hashing (LSH), Quantização, Árvores, etc., que podem ajudar a recuperar mais rapidamente itens semelhantes</li>
<li><strong>Métodos de pesquisa não exaustivos:</strong> São utilizados principalmente para evitar a pesquisa exaustiva e incluem métodos como gráficos de vizinhança, índices invertidos, etc.</li>
</ul>
<p>Isto estabelece que, para criar qualquer aplicação de pesquisa por semelhança de vectores, é necessária uma base de dados que possa ajudá-lo a armazenar, indexar e consultar (pesquisar) de forma eficiente e em grande escala. Eis as bases de dados vectoriais!</p>
<h2 id="What-is-a-Vector-Database" class="common-anchor-header">O que é uma base de dados vetorial?<button data-href="#What-is-a-Vector-Database" class="anchor-icon" translate="no">
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
    </button></h2><p>Dado que agora compreendemos como os vectores podem ser utilizados para representar dados não estruturados e como funciona a pesquisa vetorial, podemos combinar os dois conceitos para criar uma base de dados vetorial.</p>
<p>As bases de dados vectoriais são plataformas de dados escaláveis para armazenar, indexar e consultar vectores de incorporação gerados a partir de dados não estruturados (imagens, texto, etc.) utilizando modelos de aprendizagem profunda.</p>
<p>O tratamento de um grande número de vectores para pesquisa de semelhanças (mesmo com índices) pode ser muito dispendioso. Apesar disso, as melhores e mais avançadas bases de dados vectoriais devem permitir-lhe inserir, indexar e pesquisar milhões ou milhares de milhões de vectores-alvo, para além de especificar um algoritmo de indexação e uma métrica de semelhança à sua escolha.</p>
<p>As bases de dados vectoriais devem, sobretudo, satisfazer os seguintes requisitos-chave, considerando um sistema robusto de gestão de bases de dados a utilizar na empresa:</p>
<ol>
<li><strong>Escalável:</strong> As bases de dados vectoriais devem ser capazes de indexar e executar uma pesquisa aproximada do vizinho mais próximo para milhares de milhões de vectores de incorporação</li>
<li><strong>Fiáveis:</strong> As bases de dados vectoriais devem ser capazes de lidar com falhas internas sem perda de dados e com um impacto operacional mínimo, ou seja, devem ser tolerantes a falhas</li>
<li><strong>Rápidas:</strong> As velocidades de consulta e de escrita são importantes para as bases de dados vectoriais. Para plataformas como o Snapchat e o Instagram, que podem ter centenas ou milhares de novas imagens carregadas por segundo, a velocidade torna-se um fator extremamente importante.</li>
</ol>
<p>As bases de dados vectoriais não se limitam a armazenar vectores de dados. Também são responsáveis pela utilização de estruturas de dados eficientes para indexar estes vectores para uma recuperação rápida e suportar operações CRUD (criar, ler, atualizar e eliminar). Idealmente, as bases de dados vectoriais devem também suportar a filtragem de atributos, ou seja, a filtragem baseada em campos de metadados que são normalmente campos escalares. Um exemplo simples seria a recuperação de sapatos semelhantes com base nos vectores de imagens de uma marca específica. Neste caso, a marca seria o atributo com base no qual a filtragem seria efectuada.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Bitmask_f72259b751.png" alt="figure 5" class="doc-image" id="figure-5" />
   </span> <span class="img-wrapper"> <span>Figura 5</span> </span></p>
<p>A figura acima mostra como <a href="https://milvus.io/">o Milvus</a>, a base de dados vetorial de que falaremos em breve, utiliza a filtragem por atributos. <a href="https://milvus.io/">O Milvus</a> introduz o conceito de uma máscara de bits no mecanismo de filtragem para manter vectores semelhantes com uma máscara de bits de 1, com base na satisfação de filtros de atributos específicos. Mais detalhes sobre isso <a href="https://zilliz.com/learn/attribute-filtering">aqui</a>.</p>
<h2 id="Milvus--The-World’s-Most-Advanced-Vector-Database" class="common-anchor-header">Milvus - A base de dados vetorial mais avançada do mundo<button data-href="#Milvus--The-World’s-Most-Advanced-Vector-Database" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://milvus.io/">O Milvus</a> é uma plataforma de gestão de bases de dados vectoriais de código aberto criada especificamente para dados vectoriais em grande escala e para simplificar as operações de aprendizagem automática (MLOps).</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/milvus_Logo_ee3ae48b61.png" alt="figure 6" class="doc-image" id="figure-6" />
   </span> <span class="img-wrapper"> <span>figura 6</span> </span></p>
<p><a href="https://zilliz.com/">A Zilliz</a> é a organização por detrás da construção <a href="https://milvus.io/">da Milvus</a>, a base de dados vetorial mais avançada do mundo, para acelerar o desenvolvimento da próxima geração de tecido de dados. Milvus é atualmente um projeto de graduação na <a href="https://lfaidata.foundation/">LF AI &amp; Data Foundation</a> e centra-se na gestão de enormes conjuntos de dados não estruturados para armazenamento e pesquisa. A eficiência e a fiabilidade da plataforma simplificam o processo de implementação de modelos de IA e MLOps em escala. O Milvus tem amplas aplicações que abrangem a descoberta de medicamentos, visão computacional, sistemas de recomendação, chatbots e muito mais.</p>
<h3 id="Key-Features-of-Milvus" class="common-anchor-header">Principais caraterísticas do Milvus</h3><p>O Milvus está repleto de recursos e capacidades úteis, tais como:</p>
<ul>
<li><strong>Velocidades de pesquisa incríveis em um trilhão de conjuntos de dados vetoriais:</strong> A latência média da pesquisa e recuperação de vetores foi medida em milissegundos em um trilhão de conjuntos de dados vetoriais.</li>
<li><strong>Gerenciamento simplificado de dados não estruturados:</strong> Milvus tem APIs ricas projetadas para fluxos de trabalho de ciência de dados.</li>
<li><strong>Base de dados vetorial fiável e sempre ativa:</strong> As funcionalidades incorporadas de replicação e failover/failback do Milvus garantem que os dados e as aplicações podem manter sempre a continuidade do negócio.</li>
<li><strong>Altamente escalável e elástico:</strong> A escalabilidade ao nível do componente torna possível aumentar e diminuir a escala a pedido.</li>
<li><strong>Pesquisa híbrida:</strong> Para além de vectores, o Milvus suporta tipos de dados como Boolean, String, inteiros, números de vírgula flutuante, entre outros. O Milvus combina a filtragem escalar com uma poderosa pesquisa de semelhança de vectores (como visto no exemplo de semelhança de sapatos anteriormente).</li>
<li><strong>Estrutura Lambda unificada:</strong> O Milvus combina processamento de fluxo e lote para armazenamento de dados para equilibrar pontualidade e eficiência.</li>
<li><strong><a href="https://milvus.io/docs/v2.0.x/timetravel_ref.md">Viagem no tempo</a>:</strong> O Milvus mantém uma linha do tempo para todas as operações de inserção e exclusão de dados. Permite que os utilizadores especifiquem marcas de tempo numa pesquisa para recuperar uma vista de dados num determinado momento.</li>
<li><strong>Apoiado pela comunidade e reconhecido pela indústria:</strong> Com mais de 1.000 utilizadores empresariais, mais de 10.5K estrelas no <a href="https://github.com/milvus-io/milvus">GitHub</a> e uma comunidade de código aberto ativa, não está sozinho quando utiliza o Milvus. Como um projeto de pós-graduação no âmbito da <a href="https://lfaidata.foundation/">LF AI &amp; Data Foundation</a>, o Milvus tem apoio institucional.</li>
</ul>
<h3 id="Existing-Approaches-to-Vector-Data-Management-and-Search" class="common-anchor-header">Abordagens existentes à gestão e pesquisa de dados vectoriais</h3><p>Uma maneira comum de construir um sistema de IA alimentado por pesquisa de similaridade vetorial é emparelhar algoritmos como o Approximate Nearest Neighbor Search (ANNS) com bibliotecas de código aberto, como:</p>
<ul>
<li><strong><a href="https://ai.facebook.com/tools/faiss/">Facebook AI Similarity Search (FAISS)</a>:</strong> Esta estrutura permite uma pesquisa de semelhanças eficiente e o agrupamento de vectores densos. Contém algoritmos que pesquisam em conjuntos de vectores de qualquer tamanho, até aqueles que possivelmente não cabem na RAM. Suporta capacidades de indexação como multi-indexação invertida e quantização de produtos</li>
<li><strong><a href="https://github.com/spotify/annoy">Spotify's Annoy (Approximate Nearest Neighbors Oh Yeah)</a>:</strong> Esta estrutura usa <a href="http://en.wikipedia.org/wiki/Locality-sensitive_hashing#Random_projection">projecções aleatórias</a> e constrói uma árvore para permitir ANNS em escala para vectores densos</li>
<li><strong><a href="https://github.com/google-research/google-research/tree/master/scann">ScaNN (Scalable Nearest Neighbors) do Google</a>:</strong> Esta estrutura efectua uma pesquisa eficiente de semelhanças vectoriais à escala. Consiste em implementações, que incluem a poda do espaço de pesquisa e a quantização para a Pesquisa de Produto Interno Máximo (MIPS)</li>
</ul>
<p>Embora cada uma destas bibliotecas seja útil à sua maneira, devido a várias limitações, estas combinações algoritmo-biblioteca não são equivalentes a um sistema completo de gestão de dados vectoriais como o Milvus. Iremos agora discutir algumas dessas limitações.</p>
<h3 id="Limitations-of-Existing-Approaches" class="common-anchor-header">Limitações das abordagens existentes</h3><p>As abordagens existentes utilizadas para a gestão de dados vectoriais, tal como referido na secção anterior, têm as seguintes limitações</p>
<ol>
<li><strong>Flexibilidade:</strong> Os sistemas existentes normalmente armazenam todos os dados na memória principal, pelo que não podem ser executados facilmente em modo distribuído em várias máquinas e não são adequados para lidar com conjuntos de dados maciços</li>
<li><strong>Tratamento dinâmico dos dados:</strong> Os dados são frequentemente considerados estáticos uma vez introduzidos nos sistemas existentes, o que complica o processamento de dados dinâmicos e impossibilita a pesquisa quase em tempo real</li>
<li><strong>Processamento avançado de consultas:</strong> A maioria das ferramentas não suporta o processamento avançado de consultas (por exemplo, filtragem de atributos, pesquisa híbrida e consultas multi-vectoriais), o que é essencial para a construção de motores de pesquisa por semelhança no mundo real que suportem filtragem avançada.</li>
<li><strong>Optimizações de computação heterogénea:</strong> Poucas plataformas oferecem optimizações para arquitecturas de sistemas heterogéneos em CPUs e GPUs (excluindo FAISS), o que leva a perdas de eficiência.</li>
</ol>
<p><a href="https://milvus.io/">O Milvus</a> tenta ultrapassar todas estas limitações e discutiremos isto em pormenor na próxima secção.</p>
<h3 id="The-Milvus-Advantage-Understanding-Knowhere" class="common-anchor-header">A vantagem do Milvus - Compreender o Knowhere</h3><p><a href="https://milvus.io/">O Milvus</a> tenta enfrentar e resolver com sucesso as limitações dos sistemas existentes, construídos sobre algoritmos ineficientes de gestão de dados vectoriais e de pesquisa de semelhanças, das seguintes formas</p>
<ul>
<li>Aumenta a flexibilidade ao oferecer suporte para uma variedade de interfaces de aplicação (incluindo SDKs em Python, Java, Go, C++ e APIs RESTful)</li>
<li>Suporta vários tipos de índices vectoriais (por exemplo, índices baseados em quantização e índices baseados em gráficos) e processamento avançado de consultas</li>
<li>O Milvus lida com dados vetoriais dinâmicos usando uma árvore de mesclagem estruturada em log (árvore LSM), mantendo as inserções e exclusões de dados eficientes e as pesquisas funcionando em tempo real</li>
<li>O Milvus também fornece optimizações para arquitecturas de computação heterogéneas em CPUs e GPUs modernas, permitindo que os programadores ajustem os sistemas a cenários, conjuntos de dados e ambientes de aplicação específicos</li>
</ul>
<p>Knowhere, o motor de execução de vectores do Milvus, é uma interface de operação para aceder a serviços nas camadas superiores do sistema e a bibliotecas de pesquisa de semelhanças vectoriais como Faiss, Hnswlib e Annoy nas camadas inferiores do sistema. Além disso, o Knowhere é também responsável pela computação heterogénea. O Knowhere controla em que hardware (por exemplo, CPU ou GPU) executar a criação de índices e os pedidos de pesquisa. É assim que o Knowhere recebe o seu nome - saber onde executar as operações. Mais tipos de hardware, incluindo DPU e TPU, serão suportados em versões futuras.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/knowhere_architecture_f1be3dbb1a.png" alt="figure 7" class="doc-image" id="figure-7" />
   </span> <span class="img-wrapper"> <span>figura 7</span> </span></p>
<p>A computação em Milvus envolve principalmente operações vectoriais e escalares. Em Milvus, o Knowhere apenas trata as operações sobre vectores. A figura acima ilustra a arquitetura Knowhere em Milvus. A camada mais baixa é o hardware do sistema. As bibliotecas de índice de terceiros estão na parte superior do hardware. Em seguida, o Knowhere interage com o nó de índice e o nó de consulta na parte superior através do CGO. O Knowhere não só amplia as funções do Faiss, como também optimiza o desempenho e tem várias vantagens, incluindo o suporte para BitsetView, suporte para mais métricas de semelhança, suporte para o conjunto de instruções AVX512, seleção automática de instruções SIMD e outras optimizações de desempenho. Os detalhes podem ser encontrados <a href="https://milvus.io/blog/deep-dive-8-knowhere.md">aqui</a>.</p>
<h3 id="Milvus-Architecture" class="common-anchor-header">Arquitetura Milvus</h3><p>A figura seguinte mostra a arquitetura geral da plataforma Milvus. A Milvus separa o fluxo de dados do fluxo de controlo e está dividida em quatro camadas que são independentes em termos de escalabilidade e recuperação de desastres.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/milvus_architecture_ca80be5f96.png" alt="figure 8" class="doc-image" id="figure-8" />
   </span> <span class="img-wrapper"> <span>Figura 8</span> </span></p>
<ul>
<li><strong>Camada de acesso:</strong> A camada de acesso é composta por um grupo de proxies sem estado e funciona como camada frontal do sistema e ponto final para os utilizadores.</li>
<li><strong>Serviço de coordenação:</strong> O serviço de coordenação é responsável pela gestão dos nós da topologia do cluster, pelo equilíbrio de carga, pela geração de carimbos de data/hora, pela declaração e gestão dos dados</li>
<li><strong>Nós de trabalho:</strong> O nó de trabalho, ou de execução, executa as instruções emitidas pelo serviço coordenador e os comandos da linguagem de manipulação de dados (DML) iniciados pelo proxy. Um nó de trabalho no Milvus é semelhante a um nó de dados no <a href="https://hadoop.apache.org/">Hadoop</a>, ou um servidor de região no HBase</li>
<li><strong>Armazenamento:</strong> Esta é a pedra angular do Milvus, responsável pela persistência dos dados. A camada de armazenamento é composta por <strong>meta store</strong>, <strong>log broker</strong> e <strong>object storage</strong></li>
</ul>
<p>Veja mais detalhes sobre a arquitetura <a href="https://milvus.io/docs/v2.0.x/four_layers.md">aqui</a>!</p>
<h2 id="Performing-visual-image-search-with-Milvus--A-use-case-blueprint" class="common-anchor-header">Efetuar pesquisa visual de imagens com o Milvus - Um projeto de caso de utilização<button data-href="#Performing-visual-image-search-with-Milvus--A-use-case-blueprint" class="anchor-icon" translate="no">
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
    </button></h2><p>As bases de dados vectoriais de código aberto como o Milvus permitem a qualquer empresa criar o seu próprio sistema de pesquisa de imagens visuais com um número mínimo de passos. Os programadores podem utilizar modelos de IA pré-treinados para converter os seus próprios conjuntos de dados de imagens em vectores e, em seguida, utilizar o Milvus para permitir a pesquisa de produtos semelhantes por imagem. Vejamos o seguinte esquema de como conceber e construir um sistema deste tipo.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Workflow_for_Visual_Image_Search_c490906a58.jpeg" alt="figure 9" class="doc-image" id="figure-9" />
   </span> <span class="img-wrapper"> <span>figura 9</span> </span></p>
<p>Neste fluxo de trabalho, podemos utilizar uma estrutura de código aberto como o <a href="https://github.com/towhee-io/towhee">towhee</a> para utilizar um modelo pré-treinado como o ResNet-50 e extrair vectores de imagens, armazenar e indexar estes vectores com facilidade no Milvus e também armazenar um mapeamento de IDs de imagens para as imagens reais numa base de dados MySQL. Uma vez indexados os dados, podemos carregar qualquer imagem nova com facilidade e efetuar pesquisas de imagens à escala utilizando o Milvus. A figura seguinte mostra um exemplo de pesquisa visual de imagens.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Sample_Visual_Search_Example_52c6410dfd.png" alt="figure 10" class="doc-image" id="figure-10" />
   </span> <span class="img-wrapper"> <span>figura 10</span> </span></p>
<p>Veja o <a href="https://github.com/milvus-io/bootcamp/tree/master/solutions/reverse_image_search/quick_deploy">tutorial</a> detalhado que foi disponibilizado no GitHub graças ao Milvus.</p>
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
    </button></h2><p>Cobrimos uma boa quantidade de terreno neste artigo. Começámos com os desafios na representação de dados não estruturados, aproveitando os vectores e a pesquisa de semelhanças vectoriais em escala com o Milvus, uma base de dados vetorial de código aberto. Discutimos pormenores sobre a estrutura do Milvus e os principais componentes que o alimentam, bem como um plano de como resolver um problema do mundo real, a pesquisa de imagens visuais com o Milvus. Experimente e comece a resolver os seus próprios problemas do mundo real com o <a href="https://milvus.io/">Milvus</a>!</p>
<p>Gostou deste artigo? Entre <a href="https://www.linkedin.com/in/dipanzan/">em contacto comigo</a> para discutir mais sobre o assunto ou dar o seu feedback!</p>
<h2 id="About-the-author" class="common-anchor-header">Sobre o autor<button data-href="#About-the-author" class="anchor-icon" translate="no">
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
    </button></h2><p>Dipanjan (DJ) Sarkar é líder em ciência de dados, especialista em desenvolvedor do Google - aprendizado de máquina, autor, consultor e consultor de IA. Contacto: http://bit.ly/djs_linkedin</p>
