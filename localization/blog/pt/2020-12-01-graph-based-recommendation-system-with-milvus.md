---
id: graph-based-recommendation-system-with-milvus.md
title: Como funcionam os sistemas de recomendação?
author: Shiyu Chen
date: 2020-12-01T21:41:08.582Z
desc: >-
  Os sistemas de recomendação podem gerar receitas, reduzir custos e oferecer
  uma vantagem competitiva. Saiba como criar um gratuitamente com ferramentas de
  código aberto.
cover: >-
  assets.zilliz.com/thisisengineering_raeng_z3c_Mj_I6k_P_I_unsplash_2228b9411c.jpg
tag: Scenarios
canonicalUrl: 'https://zilliz.com/blog/graph-based-recommendation-system-with-milvus'
---
<custom-h1>Criação de um sistema de recomendação baseado em gráficos com os conjuntos de dados Milvus, PinSage, DGL e MovieLens</custom-h1><p>Os sistemas de recomendação são alimentados por algoritmos que tiveram <a href="https://www.npr.org/2021/06/03/1002772749/the-rise-of-recommendation-systems-how-machines-figure-out-the-things-we-want">um início humilde,</a> ajudando os seres humanos a filtrar e-mails indesejados. Em 1990, o inventor Doug Terry utilizou um algoritmo de filtragem colaborativa para separar o correio eletrónico desejável do lixo eletrónico. Simplesmente "gostando" ou "odiando" um e-mail, em colaboração com outros que faziam o mesmo com conteúdos de e-mail semelhantes, os utilizadores podiam treinar rapidamente os computadores para determinarem o que deviam enviar para a caixa de entrada do utilizador - e o que deviam sequestrar para a pasta do lixo eletrónico.</p>
<p>De um modo geral, os sistemas de recomendação são algoritmos que fazem sugestões relevantes aos utilizadores. As sugestões podem ser filmes para ver, livros para ler, produtos para comprar ou qualquer outra coisa, dependendo do cenário ou do sector. Estes algoritmos estão à nossa volta, influenciando o conteúdo que consumimos e os produtos que compramos a grandes empresas tecnológicas como o Youtube, a Amazon, a Netflix e muitas outras.</p>
<p>Os sistemas de recomendação bem concebidos podem ser geradores de receitas essenciais, redutores de custos e factores de diferenciação competitiva. Graças à tecnologia de código aberto e à redução dos custos de computação, os sistemas de recomendação personalizados nunca foram tão acessíveis. Este artigo explica como usar o Milvus, um banco de dados vetorial de código aberto; o PinSage, uma rede neural convolucional de gráficos (GCN); a biblioteca de gráficos profundos (DGL), um pacote python escalável para aprendizado profundo em gráficos; e os conjuntos de dados do MovieLens para criar um sistema de recomendação baseado em gráficos.</p>
<p><strong>Saltar para:</strong></p>
<ul>
<li><a href="#how-do-recommendation-systems-work">Como é que os sistemas de recomendação funcionam?</a></li>
<li><a href="#tools-for-building-a-recommender-system">Ferramentas para criar um sistema de recomendação</a></li>
<li><a href="#building-a-graph-based-recommender-system-with-milvus">Criação de um sistema de recomendação baseado em gráficos com o Milvus</a></li>
</ul>
<h2 id="How-do-recommendation-systems-work" class="common-anchor-header">Como funcionam os sistemas de recomendação?<button data-href="#How-do-recommendation-systems-work" class="anchor-icon" translate="no">
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
    </button></h2><p>Existem duas abordagens comuns para a criação de sistemas de recomendação: filtragem colaborativa e filtragem baseada em conteúdo. A maioria dos programadores utiliza um ou ambos os métodos e, embora os sistemas de recomendação possam variar em termos de complexidade e construção, normalmente incluem três elementos principais:</p>
<ol>
<li><strong>Modelo do utilizador:</strong> Os sistemas de recomendação requerem a modelação das caraterísticas, preferências e necessidades do utilizador. Muitos sistemas de recomendação baseiam as suas sugestões em informações implícitas ou explícitas dos utilizadores ao nível dos itens.</li>
<li><strong>Modelo de objeto:</strong> Os sistemas de recomendação também modelam itens para fazer recomendações de itens com base nos retratos dos utilizadores.</li>
<li><strong>Algoritmo de recomendação:</strong> O componente central de qualquer sistema de recomendação é o algoritmo que fornece as suas recomendações. Os algoritmos normalmente utilizados incluem a filtragem colaborativa, a modelação semântica implícita, a modelação baseada em gráficos, a recomendação combinada, entre outros.</li>
</ol>
<p>A um nível elevado, os sistemas de recomendação que se baseiam na filtragem colaborativa constroem um modelo a partir do comportamento anterior do utilizador (incluindo entradas de comportamento de utilizadores semelhantes) para prever aquilo em que um utilizador poderá estar interessado. Os sistemas que se baseiam na filtragem baseada no conteúdo utilizam etiquetas discretas e predefinidas com base nas caraterísticas do item para recomendar itens semelhantes.</p>
<p>Um exemplo de filtragem colaborativa seria uma estação de rádio personalizada no Spotify que se baseia no histórico de audição de um utilizador, nos seus interesses, na sua biblioteca de música e muito mais. A estação reproduz música que o utilizador não guardou nem manifestou interesse, mas que outros utilizadores com gostos semelhantes costumam ouvir. Um exemplo de filtragem baseada no conteúdo seria uma estação de rádio baseada numa canção ou artista específico que utiliza atributos da entrada para recomendar música semelhante.</p>
<h2 id="Tools-for-building-a-recommender-system" class="common-anchor-header">Ferramentas para construir um sistema de recomendação<button data-href="#Tools-for-building-a-recommender-system" class="anchor-icon" translate="no">
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
    </button></h2><p>Neste exemplo, a criação de um sistema de recomendação baseado em grafos a partir do zero depende das seguintes ferramentas:</p>
<h3 id="Pinsage-A-graph-convolutional-network" class="common-anchor-header">Pinsage: Uma rede convolucional de grafos</h3><p><a href="https://medium.com/pinterest-engineering/pinsage-a-new-graph-convolutional-neural-network-for-web-scale-recommender-systems-88795a107f48">O PinSage</a> é uma rede convolucional de grafos de passeio aleatório capaz de aprender embeddings para nós em grafos à escala da Web que contêm milhares de milhões de objectos. A rede foi desenvolvida pelo <a href="https://www.pinterest.com/">Pinterest</a>, uma empresa online de pinboards, para oferecer recomendações visuais temáticas aos seus utilizadores.</p>
<p>Os utilizadores do Pinterest podem "fixar" conteúdos que lhes interessam em "quadros", que são colecções de conteúdos fixados. Com mais de <a href="https://business.pinterest.com/audience/">478 milhões de</a> utilizadores activos mensais (MAU) e mais de <a href="https://newsroom.pinterest.com/en/company">240 mil milhões de</a> objectos guardados, a empresa tem uma quantidade imensa de dados de utilizadores que tem de desenvolver novas tecnologias para acompanhar.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1_742d28f7a9.png" alt="1.png" class="doc-image" id="1.png" />
   </span> <span class="img-wrapper"> <span>1.png</span> </span></p>
<p>O PinSage utiliza gráficos bipartidos de pins-boards para gerar embeddings de alta qualidade a partir de pins que são utilizados para recomendar conteúdos visualmente semelhantes aos utilizadores. Ao contrário dos algoritmos GCN tradicionais, que efectuam convoluções nas matrizes de caraterísticas e no gráfico completo, o PinSage recolhe amostras dos nós/Pins próximos e efectua convoluções locais mais eficientes através da construção dinâmica de gráficos computacionais.</p>
<p>A realização de convoluções em toda a vizinhança de um nó resultará num gráfico computacional maciço. Para reduzir os requisitos de recursos, os algoritmos GCN tradicionais actualizam a representação de um nó agregando informações da sua vizinhança de k-hop. O PinSage simula o random-walk para definir o conteúdo frequentemente visitado como a vizinhança chave e, em seguida, constrói uma convolução com base nele.</p>
<p>Como existe frequentemente sobreposição nas vizinhanças de k-hop, a convolução local nos nós resulta em computação repetida. Para o evitar, em cada passo agregado, o PinSage mapeia todos os nós sem cálculos repetidos, liga-os depois aos nós de nível superior correspondentes e, finalmente, recupera os embeddings dos nós de nível superior.</p>
<h3 id="Deep-Graph-Library-A-scalable-python-package-for-deep-learning-on-graphs" class="common-anchor-header">Biblioteca de Grafos Profundos: Um pacote python escalável para aprendizagem profunda em gráficos</h3><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/dgl_framework_building_graph_based_recommender_milvus_af62de6dd4.png" alt="dgl-framework-building-graph-based-recommender-milvus.png" class="doc-image" id="dgl-framework-building-graph-based-recommender-milvus.png" />
   </span> <span class="img-wrapper"> <span>dgl-framework-building-graph-based-recommender-milvus.png</span> </span></p>
<p><a href="https://www.dgl.ai/">A Biblioteca de Grafos Profundos (DGL)</a> é um pacote Python concebido para construir modelos de redes neurais baseados em grafos em cima de estruturas de aprendizagem profunda existentes (por exemplo, PyTorch, MXNet, Gluon, e mais). O DGL inclui uma interface de backend de fácil utilização, facilitando a implantação em quadros baseados em tensores e que suportam a geração automática. O algoritmo PinSage mencionado acima é optimizado para utilização com DGL e PyTorch.</p>
<h3 id="Milvus-An-open-source-vector-database-built-for-AI-and-similarity-search" class="common-anchor-header">Milvus: Uma base de dados vetorial de código aberto criada para IA e pesquisa de semelhanças</h3><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/how_does_milvus_work_6926180543.png" alt="how-does-milvus-work.png" class="doc-image" id="how-does-milvus-work.png" />
   </span> <span class="img-wrapper"> <span>como-funciona-milvus.png</span> </span></p>
<p>O Milvus é uma base de dados vetorial de código aberto criada para potenciar a pesquisa de semelhanças vectoriais e aplicações de inteligência artificial (IA). Num nível elevado, a utilização do Milvus para pesquisa de semelhanças funciona da seguinte forma:</p>
<ol>
<li>São utilizados modelos de aprendizagem profunda para converter dados não estruturados em vectores de caraterísticas, que são importados para o Milvus.</li>
<li>O Milvus armazena e indexa os vectores de caraterísticas.</li>
<li>Mediante pedido, o Milvus procura e devolve os vectores mais semelhantes a um vetor de entrada.</li>
</ol>
<h2 id="Building-a-graph-based-recommendation-system-with-Milvus" class="common-anchor-header">Criar um sistema de recomendação baseado em grafos com o Milvus<button data-href="#Building-a-graph-based-recommendation-system-with-Milvus" class="anchor-icon" translate="no">
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
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/beike_intelligent_house_platform_diagram_6e278da118.jpg" alt="beike-intelligent-house-platform-diagram.jpg" class="doc-image" id="beike-intelligent-house-platform-diagram.jpg" />
   </span> <span class="img-wrapper"> <span>beike-intelligent-house-platform-diagram.jpg</span> </span></p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/3_building_graph_based_recommender_system_bf89770634.png" alt="3-building-graph-based-recommender-system.png" class="doc-image" id="3-building-graph-based-recommender-system.png" />
   </span> <span class="img-wrapper"> <span>3-construir-sistema-de-recomendação-baseado-em-grafos.png</span> </span></p>
<p>A construção de um sistema de recomendação baseado em gráficos com Milvus envolve os seguintes passos:</p>
<h3 id="Step-1-Preprocess-data" class="common-anchor-header">Passo 1: Pré-processar dados</h3><p>O pré-processamento de dados envolve a transformação de dados brutos num formato mais facilmente compreensível. Este exemplo utiliza os conjuntos de dados abertos MovieLens[5] (m1-1m), que contêm 1.000.000 de classificações de 4.000 filmes, contribuídas por 6.000 utilizadores. Estes dados foram recolhidos pelo GroupLens e incluem descrições de filmes, classificações de filmes e caraterísticas dos utilizadores.</p>
<p>Note-se que os conjuntos de dados do MovieLens utilizados neste exemplo requerem uma limpeza ou organização mínima dos dados. No entanto, se você estiver usando conjuntos de dados diferentes, sua milhagem pode variar.</p>
<p>Para começar a criar um sistema de recomendação, crie um gráfico bipartido de usuário-filme para fins de classificação usando dados históricos de usuário-filme do conjunto de dados do MovieLens.</p>
<pre><code translate="no">graph_builder = PandasGraphBuilder()
graph_builder.add_entities(users, 'user_id', 'user')
graph_builder.add_entities(movies_categorical, 'movie_id', 'movie')
graph_builder.add_binary_relations(ratings, 'user_id', 'movie_id', 'watched')
graph_builder.add_binary_relations(ratings, 'movie_id', 'user_id', 'watched-by')
g = graph_builder.build()
</code></pre>
<h3 id="Step-2-Train-model-with-PinSage" class="common-anchor-header">Etapa 2: treinar o modelo com o PinSage</h3><p>Os vectores de incorporação de pinos gerados com o modelo PinSage são vectores de caraterísticas das informações de filmes adquiridas. Crie um modelo PinSage com base no gráfico bipartido g e nas dimensões personalizadas do vetor de caraterísticas do filme (256-d por predefinição). Em seguida, treine o modelo com o PyTorch para obter os embeddings h_item de 4.000 filmes.</p>
<pre><code translate="no"># Define the model
model = PinSAGEModel(g, item_ntype, textset, args.hidden_dims, args.num_layers).to(device)
opt = torch.optim.Adam(model.parameters(), lr=args.lr)
# Get the item embeddings
for blocks in dataloader_test:
   for i in range(len(blocks)):
   blocks[i] = blocks[i].to(device)
   h_item_batches.append(model.get_repr(blocks))
h_item = torch.cat(h_item_batches, 0)
</code></pre>
<h3 id="Step-3-Load-data" class="common-anchor-header">Etapa 3: Carregar dados</h3><p>Carregue os embeddings de filmes h_item gerados pelo modelo PinSage no Milvus, que devolverá os IDs correspondentes. Importe os IDs e as informações dos filmes correspondentes para o MySQL.</p>
<pre><code translate="no"># Load data to Milvus and MySQL
status, ids = milvus.insert(milvus_table, h_item)
load_movies_to_mysql(milvus_table, ids_info)
</code></pre>
<h3 id="Step-4-Conduct-vector-similarity-search" class="common-anchor-header">Passo 4: Efetuar uma pesquisa de semelhança de vectores</h3><p>Obtenha os embeddings correspondentes no Milvus com base nos IDs dos filmes e, em seguida, utilize o Milvus para efetuar uma pesquisa de semelhança com estes embeddings. Em seguida, identificar a informação do filme correspondente numa base de dados MySQL.</p>
<pre><code translate="no"># Get embeddings that users like
_, user_like_vectors = milvus.get_entity_by_id(milvus_table, ids)
# Get the information with similar movies
_, ids = milvus.search(param = {milvus_table, user_like_vectors, top_k})
sql = &quot;select * from &quot; + movies_table + &quot; where milvus_id=&quot; + ids + &quot;;&quot;
results = cursor.execute(sql).fetchall()
</code></pre>
<h3 id="Step-5-Get-recommendations" class="common-anchor-header">Passo 5: Obter recomendações</h3><p>O sistema irá agora recomendar os filmes mais semelhantes às consultas de pesquisa dos utilizadores. Este é o fluxo de trabalho geral para criar um sistema de recomendação. Para testar e implementar rapidamente sistemas de recomendação e outras aplicações de IA, experimente o <a href="https://github.com/milvus-io/bootcamp">bootcamp do</a> Milvus.</p>
<h2 id="Milvus-can-power-more-than-recommender-systems" class="common-anchor-header">O Milvus pode fornecer mais do que sistemas de recomendação<button data-href="#Milvus-can-power-more-than-recommender-systems" class="anchor-icon" translate="no">
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
    </button></h2><p>O Milvus é uma ferramenta poderosa capaz de alimentar uma vasta gama de aplicações de inteligência artificial e de pesquisa de semelhanças vectoriais. Para saber mais sobre o projeto, consulte os seguintes recursos:</p>
<ul>
<li>Leia o nosso <a href="https://zilliz.com/blog">blogue</a>.</li>
<li>Interagir com a nossa comunidade de código aberto no <a href="https://join.slack.com/t/milvusio/shared_invite/zt-e0u4qu3k-bI2GDNys3ZqX1YCJ9OM~GQ">Slack</a>.</li>
<li>Utilize ou contribua para a base de dados vetorial mais popular do mundo no <a href="https://github.com/milvus-io/milvus/">GitHub</a>.</li>
</ul>
