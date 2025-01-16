---
id: building-a-wardrobe-and-outfit-planning-app-with-milvus.md
title: Descrição geral do sistema
author: Yu Fang
date: 2021-07-09T06:30:06.439Z
desc: >-
  Descubra como a Milvus, uma base de dados vetorial de código aberto, é
  utilizada pela Mozat para alimentar uma aplicação de moda que oferece
  recomendações de estilo personalizadas e um sistema de pesquisa de imagens.
cover: assets.zilliz.com/mozat_blog_0ea9218c71.jpg
tag: Scenarios
canonicalUrl: >-
  https://zilliz.com/blog/building-a-wardrobe-and-outfit-planning-app-with-milvus
---
<custom-h1>Criar uma aplicação de planeamento do guarda-roupa e do vestuário com Milvus</custom-h1><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/stylepedia_1_5f239a8d48.png" alt="stylepedia-1.png" class="doc-image" id="stylepedia-1.png" />
   </span> <span class="img-wrapper"> <span>stylepedia-1.png</span> </span></p>
<p>Fundada em 2003, <a href="http://www.mozat.com/home">a Mozat</a> é uma start-up com sede em Singapura e escritórios na China e na Arábia Saudita. A empresa é especializada na criação de aplicações de redes sociais, comunicação e estilo de vida. <a href="https://stylepedia.com/">A Stylepedia</a> é uma aplicação de guarda-roupa criada pela Mozat que ajuda os utilizadores a descobrirem novos estilos e a ligarem-se a outras pessoas que são apaixonadas pela moda. As suas principais caraterísticas incluem a capacidade de organizar um armário digital, recomendações de estilo personalizadas, funcionalidade de redes sociais e uma ferramenta de pesquisa de imagens para encontrar artigos semelhantes a algo visto online ou na vida real.</p>
<p><a href="https://milvus.io">O Milvus</a> é utilizado para alimentar o sistema de pesquisa de imagens da Stylepedia. A aplicação lida com três tipos de imagens: imagens de utilizadores, imagens de produtos e fotografias de moda. Cada imagem pode incluir um ou mais itens, complicando ainda mais cada consulta. Para ser útil, um sistema de pesquisa de imagens tem de ser preciso, rápido e estável, caraterísticas que estabelecem uma base técnica sólida para adicionar novas funcionalidades à aplicação, tais como sugestões de roupa e recomendações de conteúdos de moda.</p>
<h2 id="System-overview" class="common-anchor-header">Descrição geral do sistema<button data-href="#System-overview" class="anchor-icon" translate="no">
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
    </button></h2><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/stylepedia_system_process_8e7e2ab3e4.png" alt="stylepedia-system-process.png" class="doc-image" id="stylepedia-system-process.png" />
   </span> <span class="img-wrapper"> <span>stylepedia-system-process.png</span> </span></p>
<p>O sistema de pesquisa de imagens está dividido em componentes offline e online.</p>
<p>Offline, as imagens são vectorizadas e inseridas numa base de dados vetorial (Milvus). No fluxo de trabalho de dados, as imagens de produtos relevantes e as fotografias de moda são convertidas em vectores de caraterísticas de 512 dimensões, utilizando modelos de deteção de objectos e de extração de caraterísticas. Os dados vectoriais são depois indexados e adicionados à base de dados vetorial.</p>
<p>Em linha, a base de dados de imagens é consultada e imagens semelhantes são devolvidas ao utilizador. À semelhança da componente off-line, uma imagem consultada é processada por modelos de deteção de objectos e de extração de caraterísticas para obter um vetor de caraterísticas. Utilizando o vetor de caraterísticas, o Milvus procura os vectores semelhantes TopK e obtém os IDs de imagem correspondentes. Finalmente, após o pós-processamento (filtragem, ordenação, etc.), é devolvida uma coleção de imagens semelhantes à imagem consultada.</p>
<h2 id="Implementation" class="common-anchor-header">Implementação<button data-href="#Implementation" class="anchor-icon" translate="no">
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
    </button></h2><p>A implementação divide-se em quatro módulos:</p>
<ol>
<li>Deteção de vestuário</li>
<li>Extração de caraterísticas</li>
<li>Pesquisa de semelhanças vectoriais</li>
<li>Pós-processamento</li>
</ol>
<h3 id="Garment-detection" class="common-anchor-header">Deteção de vestuário</h3><p>No módulo de deteção de vestuário, <a href="https://pytorch.org/hub/ultralytics_yolov5/">o YOLOv5</a>, uma estrutura de deteção de alvos baseada em âncoras e de uma fase, é utilizado como modelo de deteção de objectos devido ao seu tamanho reduzido e à inferência em tempo real. Oferece quatro tamanhos de modelo (YOLOv5s/m/l/x), e cada tamanho específico tem vantagens e desvantagens. Os modelos maiores terão um melhor desempenho (maior precisão), mas requerem muito mais potência de computação e funcionam mais lentamente. Uma vez que, neste caso, os objectos são relativamente grandes e fáceis de detetar, o modelo mais pequeno, YOLOv5s, é suficiente.</p>
<p>Os artigos de vestuário em cada imagem são reconhecidos e recortados para servirem como entradas do modelo de extração de caraterísticas utilizado no processamento subsequente. Simultaneamente, o modelo de deteção de objectos também prevê a classificação do vestuário de acordo com classes predefinidas (tops, vestuário exterior, calças, saias, vestidos e macacões).</p>
<h3 id="Feature-extraction" class="common-anchor-header">Extração de caraterísticas</h3><p>A chave para a pesquisa de semelhanças é o modelo de extração de caraterísticas. As imagens de roupas recortadas são incorporadas em vectores de ponto flutuante de 512 dimensões que representam os seus atributos num formato de dados numéricos legíveis por máquina. A metodologia <a href="https://github.com/Joon-Park92/Survey_of_Deep_Metric_Learning">de aprendizagem métrica profunda (DML)</a> é adoptada com a <a href="https://arxiv.org/abs/1905.11946">EfficientNet</a> como modelo de base.</p>
<p>A aprendizagem métrica visa treinar um módulo de extração de caraterísticas não lineares baseado numa CNN (ou um codificador) para reduzir a distância entre os vectores de caraterísticas correspondentes à mesma classe de amostras e aumentar a distância entre os vectores de caraterísticas correspondentes a diferentes classes de amostras. Neste cenário, a mesma classe de amostras refere-se à mesma peça de roupa.</p>
<p>A EfficientNet tem em conta tanto a velocidade como a precisão quando dimensiona uniformemente a largura, profundidade e resolução da rede. A EfficientNet-B4 é utilizada como rede de extração de caraterísticas e o resultado da última camada totalmente ligada são as caraterísticas de imagem necessárias para efetuar a pesquisa de semelhança de vectores.</p>
<h3 id="Vector-similarity-search" class="common-anchor-header">Pesquisa de semelhança de vectores</h3><p>O Milvus é uma base de dados vetorial de código aberto que suporta operações de criação, leitura, atualização e eliminação (CRUD), bem como pesquisa quase em tempo real em conjuntos de dados de triliões de bytes. Na Stylepedia, é utilizada para pesquisa de semelhanças vectoriais em grande escala porque é altamente elástica, estável, fiável e extremamente rápida. O Milvus alarga as capacidades das bibliotecas de índices vectoriais amplamente utilizadas (Faiss, NMSLIB, Annoy, etc.) e fornece um conjunto de API simples e intuitivas que permitem aos utilizadores selecionar o tipo de índice ideal para um determinado cenário.</p>
<p>Tendo em conta os requisitos do cenário e a escala de dados, os programadores da Stylepedia utilizaram a distribuição do Milvus apenas para CPU em conjunto com o índice HNSW. Duas colecções indexadas, uma para produtos e outra para fotografias de moda, são construídas para alimentar diferentes funcionalidades da aplicação. Cada coleção é ainda dividida em seis partições com base nos resultados da deteção e classificação para limitar o âmbito da pesquisa. O Milvus efectua pesquisas em dezenas de milhões de vectores em milissegundos, proporcionando um desempenho ótimo, mantendo os custos de desenvolvimento baixos e minimizando o consumo de recursos.</p>
<h3 id="Post-processing" class="common-anchor-header">Pós-processamento</h3><p>Para melhorar a semelhança entre os resultados da recuperação de imagens e a imagem consultada, utilizamos a filtragem de cores e a filtragem de etiquetas-chave (comprimento da manga, comprimento da roupa, estilo do colarinho, etc.) para filtrar imagens não elegíveis. Além disso, é utilizado um algoritmo de avaliação da qualidade da imagem para garantir que as imagens de maior qualidade são apresentadas primeiro aos utilizadores.</p>
<h2 id="Application" class="common-anchor-header">Aplicação<button data-href="#Application" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="User-uploads-and-image-search" class="common-anchor-header">Carregamentos do utilizador e pesquisa de imagens</h3><p>Os utilizadores podem tirar fotografias das suas próprias roupas e carregá-las para o seu armário digital Stylepedia, recuperando depois as imagens de produtos mais semelhantes às suas cargas.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/stylepedia_search_results_0568e20dc0.png" alt="stylepedia-search-results.png" class="doc-image" id="stylepedia-search-results.png" />
   </span> <span class="img-wrapper"> <span>stylepedia resultados da pesquisa.png</span> </span></p>
<h3 id="Outfit-suggestions" class="common-anchor-header">Sugestões de roupa</h3><p>Ao efetuar uma pesquisa por semelhança na base de dados da Stylepedia, os utilizadores podem encontrar fotografias de moda que contenham um artigo de moda específico. Podem ser peças de vestuário novas que alguém está a pensar comprar, ou algo da sua própria coleção que pode ser usado ou combinado de forma diferente. Em seguida, através do agrupamento dos artigos com que é frequentemente combinado, são geradas sugestões de conjuntos. Por exemplo, um casaco de motoqueiro preto pode combinar com uma variedade de artigos, como um par de calças de ganga skinny pretas. Os utilizadores podem então navegar por fotografias de moda relevantes em que esta combinação ocorre na fórmula selecionada.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/stylepedia_jacket_outfit_e84914da9e.png" alt="stylepedia-jacket-outfit.png" class="doc-image" id="stylepedia-jacket-outfit.png" />
   </span> <span class="img-wrapper"> <span>stylepedia-jacket-outfit.png</span> </span></p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/stylepedia_jacket_snapshot_25f53cc09b.png" alt="stylepedia-jacket-snapshot.png" class="doc-image" id="stylepedia-jacket-snapshot.png" />
   </span> <span class="img-wrapper"> <span>stylepedia-jacket-snapshot.png</span> </span></p>
<h3 id="Fashion-photograph-recommendations" class="common-anchor-header">Recomendações de fotografias de moda</h3><p>Com base no histórico de navegação de um utilizador, nos seus gostos e no conteúdo do seu armário digital, o sistema calcula a semelhança e fornece recomendações personalizadas de fotografias de moda que possam ser do seu interesse.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/stylepedia_user_wardrobe_6770c856b9.png" alt="stylepedia-user-wardrobe.png" class="doc-image" id="stylepedia-user-wardrobe.png" />
   </span> <span class="img-wrapper"> <span>stylepedia-user-wardrobe.png</span> </span></p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/stylepedia_streetsnap_rec_901601a34d.png" alt="stylepedia-streetsnap-rec.png" class="doc-image" id="stylepedia-streetsnap-rec.png" />
   </span> <span class="img-wrapper"> <span>stylepedia-streetsnap-rec.png</span> </span></p>
<p>Combinando metodologias de aprendizagem profunda e de visão computacional, a Mozat conseguiu criar um sistema de pesquisa de semelhanças de imagens rápido, estável e preciso, utilizando o Milvus para alimentar várias funcionalidades da aplicação Stylepedia.</p>
<h2 id="Dont-be-a-stranger" class="common-anchor-header">Não seja um estranho<button data-href="#Dont-be-a-stranger" class="anchor-icon" translate="no">
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
    </button></h2><ul>
<li>Encontre ou contribua para o Milvus no <a href="https://github.com/milvus-io/milvus/">GitHub</a>.</li>
<li>Interaja com a comunidade através do <a href="https://join.slack.com/t/milvusio/shared_invite/zt-e0u4qu3k-bI2GDNys3ZqX1YCJ9OM~GQ">Slack</a>.</li>
<li>Ligue-se a nós no <a href="https://twitter.com/milvusio">Twitter</a>.</li>
</ul>
