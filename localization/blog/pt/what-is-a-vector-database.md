---
id: what-is-vector-database-and-how-it-works.md
title: O que é exatamente uma base de dados vetorial e como funciona
author: Zilliz
date: 2025-03-24T00:00:00.000Z
desc: >-
  Uma base de dados de vectores armazena, indexa e pesquisa embeddings de
  vectores gerados por modelos de aprendizagem automática para recuperação
  rápida de informações e pesquisa de semelhanças.
cover: assets.zilliz.com/What_s_a_Vector_Database_and_How_Does_It_Work_cac0875415.png
tag: Engineering
canonicalUrl: >-
  https://milvus.io/blog/parse-is-hard-solve-semantic-understanding-with-mistral-ocr-and-milvus.md
---
<p>Uma base de dados de vectores indexa e armazena embeddings de vectores para uma recuperação rápida e pesquisa de semelhanças, com capacidades como operações CRUD, filtragem de metadados e escalonamento horizontal concebidos especificamente para aplicações de IA.</p>
<iframe width="100%" height="315" src="https://www.youtube.com/embed/4yQjsY5iD9Q" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
<h2 id="Introduction-The-Rise-of-Vector-Databases-in-the-AI-Era" class="common-anchor-header">Introdução: A ascensão das bases de dados vectoriais na era da IA<button data-href="#Introduction-The-Rise-of-Vector-Databases-in-the-AI-Era" class="anchor-icon" translate="no">
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
    </button></h2><p>Nos primórdios do ImageNet, foram necessários 25.000 curadores humanos para rotular manualmente o conjunto de dados. Esse número impressionante destaca um desafio fundamental na IA: a categorização manual de dados não estruturados simplesmente não é escalonável. Com milhares de milhões de imagens, vídeos, documentos e ficheiros de áudio gerados diariamente, era necessária uma mudança de paradigma na forma como os computadores compreendem e interagem com o conteúdo.</p>
<p>Os sistemas<a href="https://zilliz.com/blog/relational-databases-vs-vector-databases">tradicionais de bases de dados relacionais</a> são excelentes na gestão de dados estruturados com formatos predefinidos e na execução de operações de pesquisa precisas. Em contrapartida, as bases de dados vectoriais especializam-se no armazenamento e recuperação de tipos <a href="https://zilliz.com/learn/introduction-to-unstructured-data">de dados não estruturados </a>, como imagens, áudio, vídeos e conteúdos textuais, através de representações numéricas de elevada dimensão, conhecidas como embeddings vectoriais. As bases de dados vectoriais suportam <a href="https://zilliz.com/glossary/large-language-models-(llms)">modelos linguísticos de grande dimensão</a>, proporcionando uma recuperação e gestão eficientes dos dados. Os bancos de dados vetoriais modernos superam os sistemas tradicionais em 2 a 10 vezes por meio de otimização com reconhecimento de hardware (AVX512, SIMD, GPUs, SSDs NVMe), algoritmos de pesquisa altamente otimizados (HNSW, IVF, DiskANN) e design de armazenamento orientado por coluna. A sua arquitetura nativa da cloud e desacoplada permite o escalonamento independente dos componentes de pesquisa, inserção de dados e indexação, permitindo que os sistemas lidem eficientemente com milhares de milhões de vectores, mantendo o desempenho para aplicações empresariais de IA em empresas como a Salesforce, PayPal, eBay e NVIDIA.</p>
<p>Isso representa o que os especialistas chamam de "lacuna semântica" - os bancos de dados tradicionais operam em correspondências exatas e relacionamentos predefinidos, enquanto a compreensão humana do conteúdo é matizada, contextual e multidimensional. Esta lacuna torna-se cada vez mais problemática à medida que as aplicações de IA o exigem:</p>
<ul>
<li><p>Encontrar semelhanças conceptuais em vez de correspondências exactas</p></li>
<li><p>Compreender as relações contextuais entre diferentes partes do conteúdo</p></li>
<li><p>Capturar a essência semântica da informação para além das palavras-chave</p></li>
<li><p>Processar dados multimodais num quadro unificado</p></li>
</ul>
<p>As bases de dados vectoriais surgiram como a tecnologia crítica para colmatar esta lacuna, tornando-se um componente essencial na infraestrutura moderna de IA. Melhoram o desempenho dos modelos de aprendizagem automática, facilitando tarefas como o agrupamento e a classificação.</p>
<iframe style="border-radius:12px" src="https://open.spotify.com/embed/episode/1T6K6wlZuryLbETUrafO9f?utm_source=generator" width="100%" height="152" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>
<h2 id="Understanding-Vector-Embeddings-The-Foundation" class="common-anchor-header">Entendendo os Embeddings de Vetor: A base<button data-href="#Understanding-Vector-Embeddings-The-Foundation" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://zilliz.com/glossary/vector-embeddings">As incorporações v</a> ectoriais funcionam como a ponte crítica entre a lacuna semântica. Estas representações numéricas de elevada dimensão captam a essência semântica dos dados não estruturados numa forma que os computadores podem processar eficazmente. Os modelos de incorporação modernos transformam o conteúdo em bruto - seja texto, imagens ou áudio - em vectores densos onde conceitos semelhantes se agrupam no espaço vetorial, independentemente das diferenças ao nível da superfície.</p>
<p>Por exemplo, as incorporações corretamente construídas posicionariam conceitos como "automóvel", "carro" e "veículo" próximos no espaço vetorial, apesar de terem formas lexicais diferentes. Esta propriedade permite que <a href="https://zilliz.com/glossary/semantic-search">a pesquisa semântica</a>, <a href="https://zilliz.com/vector-database-use-cases/recommender-system">os sistemas de recomendação</a> e as aplicações de IA compreendam o conteúdo para além da simples correspondência de padrões.</p>
<p>O poder dos embeddings estende-se a todas as modalidades. As bases de dados vectoriais avançadas suportam vários tipos de dados não estruturados - texto, imagens, áudio - num sistema unificado, permitindo pesquisas e relações entre modalidades que anteriormente eram impossíveis de modelar eficazmente. Estas capacidades das bases de dados vectoriais são cruciais para as tecnologias orientadas para a IA, como os chatbots e os sistemas de reconhecimento de imagem, suportando aplicações avançadas como a pesquisa semântica e os sistemas de recomendação.</p>
<p>No entanto, armazenar, indexar e recuperar embeddings em escala apresenta desafios computacionais únicos para os quais os bancos de dados tradicionais não foram criados.</p>
<h2 id="Vector-Databases-Core-Concepts" class="common-anchor-header">Bases de dados vectoriais: Conceitos fundamentais<button data-href="#Vector-Databases-Core-Concepts" class="anchor-icon" translate="no">
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
    </button></h2><p>As bases de dados vectoriais representam uma mudança de paradigma na forma como armazenamos e consultamos dados não estruturados. Ao contrário dos sistemas de bases de dados relacionais tradicionais, que são excelentes na gestão de dados estruturados com formatos predefinidos, as bases de dados vectoriais são especializadas no tratamento de dados não estruturados através de representações vectoriais numéricas.</p>
<p>Na sua essência, as bases de dados vectoriais foram concebidas para resolver um problema fundamental: permitir pesquisas de semelhança eficientes em conjuntos de dados maciços de dados não estruturados. Conseguem-no através de três componentes principais:</p>
<p><strong>Embeddings vectoriais</strong>: Representações numéricas de alta dimensão que capturam o significado semântico de dados não estruturados (texto, imagens, áudio, etc.)</p>
<p><strong>Indexação especializada</strong>: Algoritmos optimizados para espaços vectoriais de elevada dimensão que permitem pesquisas rápidas e aproximadas. A base de dados de vectores indexa vectores para aumentar a velocidade e a eficiência das pesquisas de semelhança, utilizando vários algoritmos de ML para criar índices em embeddings de vectores.</p>
<p><a href="https://zilliz.com/blog/similarity-metrics-for-vector-search"><strong>Métricas de distância</strong></a>: Funções matemáticas que quantificam a semelhança entre vectores</p>
<p>A principal operação numa base de dados vetorial é a consulta <a href="https://zilliz.com/blog/k-nearest-neighbor-algorithm-for-machine-learning">k-vizinhos mais próximos</a> (KNN), que encontra os k vectores mais semelhantes a um determinado vetor de consulta. Para aplicações em grande escala, estas bases de dados implementam normalmente algoritmos de <a href="https://zilliz.com/glossary/anns">vizinho mais próximo aproximado</a> (ANN), trocando uma pequena quantidade de precisão por ganhos significativos na velocidade de pesquisa.</p>
<h3 id="Mathematical-Foundations-of-Vector-Similarity" class="common-anchor-header">Fundamentos matemáticos da similaridade vetorial</h3><p>Para compreender as bases de dados vectoriais é necessário compreender os princípios matemáticos subjacentes à similaridade vetorial. Aqui estão os conceitos fundamentais:</p>
<h3 id="Vector-Spaces-and-Embeddings" class="common-anchor-header">Espaços vetoriais e incorporações</h3><p>Uma <a href="https://zilliz.com/learn/everything-you-should-know-about-vector-embeddings">incorporação de vetor</a> é uma matriz de comprimento fixo de números de vírgula flutuante (podem variar entre 100-32.768 dimensões!) que representa dados não estruturados num formato numérico. Estas incorporações posicionam itens semelhantes mais próximos uns dos outros num espaço vetorial de elevada dimensão.</p>
<p>Por exemplo, as palavras "rei" e "rainha" teriam representações vectoriais mais próximas uma da outra do que qualquer uma delas de "automóvel" num espaço de incorporação de palavras bem treinado.</p>
<h3 id="Distance-Metrics" class="common-anchor-header">Métricas de distância</h3><p>A escolha da métrica de distância afecta fundamentalmente a forma como a semelhança é calculada. As métricas de distância comuns incluem:</p>
<ol>
<li><p><strong>Distância Euclidiana</strong>: A distância em linha reta entre dois pontos no espaço euclidiano.</p></li>
<li><p><strong>Similaridade de cosseno</strong>: Mede o cosseno do ângulo entre dois vectores, concentrando-se na orientação e não na magnitude</p></li>
<li><p><strong>Produto escalar</strong>: Para vectores normalizados, representa o grau de alinhamento de dois vectores.</p></li>
<li><p><strong>Distância de Manhattan (Norma L1)</strong>: Soma das diferenças absolutas entre coordenadas.</p></li>
</ol>
<p>Casos de uso diferentes podem exigir métricas de distância diferentes. Por exemplo, a semelhança de cosseno funciona muitas vezes bem para a incorporação de texto, enquanto a distância euclidiana pode ser mais adequada para determinados tipos de <a href="https://zilliz.com/learn/image-embeddings-for-enhanced-image-search">incorporação de imagem</a>.</p>
<p><a href="https://zilliz.com/glossary/semantic-similarity">Semelhança semântica</a> entre vectores num espaço vetorial</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Semantic_similarity_between_vectors_in_a_vector_space_ee6fb35909.png" alt="Semantic similarity between vectors in a vector space" class="doc-image" id="semantic-similarity-between-vectors-in-a-vector-space" />
   </span> <span class="img-wrapper"> <span>Semelhança semântica entre vectores num espaço vetorial</span> </span></p>
<p>A compreensão destes fundamentos matemáticos leva a uma questão importante sobre a implementação: Então, basta adicionar um índice vetorial a qualquer base de dados, certo?</p>
<p>A simples adição de um índice vetorial a uma base de dados relacional não é suficiente, nem a utilização de uma <a href="https://zilliz.com/learn/comparing-vector-database-vector-search-library-and-vector-search-plugin">biblioteca de índices vectoriais</a> autónoma. Embora os índices vectoriais forneçam a capacidade crítica de encontrar vectores semelhantes de forma eficiente, não possuem a infraestrutura necessária para aplicações de produção:</p>
<ul>
<li><p>Não fornecem operações CRUD para gerir dados vectoriais</p></li>
<li><p>Não possuem recursos de filtragem e armazenamento de metadados</p></li>
<li><p>Não oferecem escalonamento, replicação ou tolerância a falhas incorporados</p></li>
<li><p>Requerem infra-estruturas personalizadas para a persistência e gestão de dados</p></li>
</ul>
<p>As bases de dados vectoriais surgiram para dar resposta a estas limitações, fornecendo capacidades completas de gestão de dados concebidas especificamente para incorporação de vectores. Combinam o poder semântico da pesquisa vetorial com as capacidades operacionais dos sistemas de bases de dados.</p>
<p>Ao contrário das bases de dados tradicionais que funcionam com base em correspondências exactas, as bases de dados vectoriais centram-se na pesquisa semântica - encontrando vectores que são "mais semelhantes" a um vetor de consulta de acordo com métricas de distância específicas. Essa diferença fundamental impulsiona a arquitetura e os algoritmos exclusivos que alimentam esses sistemas especializados.</p>
<h2 id="Vector-Database-Architecture-A-Technical-Framework" class="common-anchor-header">Arquitetura de bases de dados vectoriais: Uma estrutura técnica<button data-href="#Vector-Database-Architecture-A-Technical-Framework" class="anchor-icon" translate="no">
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
    </button></h2><p>As bases de dados vectoriais modernas implementam uma arquitetura sofisticada em várias camadas que separa as preocupações, permite a escalabilidade e assegura a manutenção. Esta estrutura técnica vai muito além de simples índices de pesquisa para criar sistemas capazes de lidar com cargas de trabalho de IA de produção. As bases de dados vectoriais funcionam através do processamento e recuperação de informações para aplicações de IA e ML, utilizando algoritmos para pesquisas de vizinhos mais próximos, convertendo vários tipos de dados brutos em vectores e gerindo eficazmente diversos tipos de dados através de pesquisas semânticas.</p>
<h3 id="Four-Tier-Architecture" class="common-anchor-header">Arquitetura de quatro níveis</h3><p>Uma base de dados vetorial de produção é normalmente constituída por quatro camadas arquitectónicas principais:</p>
<ol>
<li><p><strong>Camada de armazenamento</strong>: Gere o armazenamento persistente de dados vectoriais e metadados, implementa estratégias especializadas de codificação e compressão e optimiza os padrões de E/S para acesso específico a vectores.</p></li>
<li><p><strong>Camada de indexação</strong>: Mantém vários algoritmos de indexação, gere a sua criação e actualizações e implementa optimizações específicas de hardware para desempenho.</p></li>
<li><p><strong>Camada de consulta</strong>: Processa as consultas recebidas, determina estratégias de execução, trata do processamento de resultados e implementa o armazenamento em cache para consultas repetidas.</p></li>
<li><p><strong>Camada de serviço</strong>: Gere as ligações dos clientes, trata do encaminhamento de pedidos, fornece monitorização e registo, e implementa a segurança e o multilocatário.</p></li>
</ol>
<h3 id="Vector-Search-Workflow" class="common-anchor-header">Fluxo de trabalho de pesquisa vetorial</h3><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Complete_workflow_of_a_vector_search_operation_7283d7546a.png" alt="Complete workflow of a vector search operation.png" class="doc-image" id="complete-workflow-of-a-vector-search-operation.png" />
   </span> <span class="img-wrapper"> <span>Fluxo de trabalho completo de uma operação de pesquisa vetorial.png</span> </span></p>
<p>Uma implementação típica de base de dados vetorial segue este fluxo de trabalho:</p>
<ol>
<li><p>Um modelo de aprendizagem automática transforma dados não estruturados (texto, imagens, áudio) em incorporações vectoriais</p></li>
<li><p>Estas incorporações vectoriais são armazenadas na base de dados juntamente com metadados relevantes</p></li>
<li><p>Quando um utilizador efectua uma consulta, esta é convertida numa incorporação vetorial utilizando o <em>mesmo</em> modelo</p></li>
<li><p>A base de dados compara o vetor de consulta com os vectores armazenados utilizando um algoritmo de vizinho mais próximo aproximado</p></li>
<li><p>O sistema devolve os K resultados mais relevantes com base na semelhança dos vectores</p></li>
<li><p>O pós-processamento opcional pode aplicar filtros adicionais ou reanálise</p></li>
</ol>
<p>Este pipeline permite uma pesquisa semântica eficiente em colecções maciças de dados não estruturados que seria impossível com abordagens tradicionais de bases de dados.</p>
<h4 id="Consistency-in-Vector-Databases" class="common-anchor-header">Consistência em bases de dados vectoriais</h4><p>Garantir a consistência em bases de dados vectoriais distribuídas é um desafio devido ao compromisso entre desempenho e correção. Embora a consistência eventual seja comum em sistemas de grande escala, são necessários modelos de consistência fortes para aplicações de missão crítica, como a deteção de fraudes e recomendações em tempo real. Técnicas como as escritas baseadas em quorum e o consenso distribuído (por exemplo, <a href="https://zilliz.com/learn/raft-or-not">Raft</a>, Paxos) garantem a integridade dos dados sem compromissos excessivos de desempenho.</p>
<p>As implementações de produção adoptam uma arquitetura de armazenamento partilhado com desagregação do armazenamento e da computação. Esta separação segue o princípio da desagregação do plano de dados e do plano de controlo, sendo cada camada escalável de forma independente para uma utilização óptima dos recursos.</p>
<h3 id="Managing-Connections-Security-and-Multitenancy" class="common-anchor-header">Gestão de ligações, segurança e multilocação</h3><p>Como estas bases de dados são utilizadas em ambientes multi-utilizador e multi-tenant, a segurança dos dados e a gestão do controlo de acesso são fundamentais para manter a confidencialidade.</p>
<p>As medidas de segurança, como a encriptação (em repouso e em trânsito), protegem os dados sensíveis, como os embeddings e os metadados. A autenticação e a autorização asseguram que apenas os utilizadores autorizados podem aceder ao sistema, com permissões refinadas para gerir o acesso a dados específicos.</p>
<p>O controlo de acesso define funções e permissões para restringir o acesso aos dados. Isso é particularmente importante para bancos de dados que armazenam informações confidenciais, como dados de clientes ou modelos de IA proprietários.</p>
<p>A multitenancy envolve o isolamento dos dados de cada locatário para impedir o acesso não autorizado, permitindo a partilha de recursos. Isto é conseguido através de sharding, particionamento ou segurança ao nível da linha para garantir um acesso escalável e seguro para diferentes equipas ou clientes.</p>
<p>Os sistemas externos de gestão de identidade e acesso (IAM) integram-se nas bases de dados vectoriais para aplicar políticas de segurança e garantir a conformidade com as normas da indústria.</p>
<h2 id="Advantages-of-Vector-Databases" class="common-anchor-header">Vantagens das bases de dados vectoriais<button data-href="#Advantages-of-Vector-Databases" class="anchor-icon" translate="no">
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
    </button></h2><p>As bases de dados vectoriais oferecem várias vantagens em relação às bases de dados tradicionais, tornando-as a escolha ideal para o tratamento de dados vectoriais. Aqui estão algumas das principais vantagens:</p>
<ol>
<li><p><strong>Pesquisa eficiente de semelhanças</strong>: Uma das caraterísticas de destaque das bases de dados vectoriais é a sua capacidade de realizar pesquisas semânticas eficientes. Ao contrário das bases de dados tradicionais que se baseiam em correspondências exactas, as bases de dados vectoriais são excelentes na procura de pontos de dados semelhantes a um determinado vetor de consulta. Esta capacidade é crucial para aplicações como os sistemas de recomendação, onde encontrar itens semelhantes às interações passadas de um utilizador pode melhorar significativamente a experiência do utilizador.</p></li>
<li><p><strong>Tratamento de dados de elevada dimensão</strong>: As bases de dados vectoriais são especificamente concebidas para gerir eficazmente dados de elevada dimensão. Isto torna-as particularmente adequadas para aplicações no processamento de linguagem natural, <a href="https://zilliz.com/learn/what-is-computer-vision">visão por computador</a> e genómica, onde os dados existem frequentemente em espaços de elevada dimensão. Ao tirar partido de algoritmos avançados de indexação e pesquisa, as bases de dados vectoriais podem recuperar rapidamente pontos de dados relevantes, mesmo em conjuntos de dados complexos com incorporação de vectores.</p></li>
<li><p><strong>Escalabilidade</strong>: A escalabilidade é um requisito essencial para as aplicações modernas de IA, e as bases de dados vectoriais são criadas para serem escaladas de forma eficiente. Seja lidando com milhões ou bilhões de vetores, os bancos de dados vetoriais podem lidar com as demandas crescentes de aplicativos de IA por meio do dimensionamento horizontal. Isso garante que o desempenho permaneça consistente mesmo com o aumento do volume de dados.</p></li>
<li><p><strong>Flexibilidade</strong>: Os bancos de dados vetoriais oferecem uma flexibilidade notável em termos de representação de dados. Podem armazenar e gerir vários tipos de dados, incluindo caraterísticas numéricas, incorporação de texto ou imagens e até dados complexos, como estruturas moleculares. Esta versatilidade faz das bases de dados vectoriais uma ferramenta poderosa para uma vasta gama de aplicações, desde a análise de texto à investigação científica.</p></li>
<li><p><strong>Aplicações em tempo real</strong>: Muitas bases de dados vectoriais estão optimizadas para consultas em tempo real ou quase real. Isto é particularmente importante para aplicações que requerem respostas rápidas, como a deteção de fraudes, recomendações em tempo real e sistemas de IA interactivos. A capacidade de realizar pesquisas rápidas de similaridade garante que esses aplicativos possam fornecer resultados relevantes e em tempo hábil.</p></li>
</ol>
<h2 id="Use-Cases-for-Vector-Databases" class="common-anchor-header">Casos de uso para bancos de dados vetoriais<button data-href="#Use-Cases-for-Vector-Databases" class="anchor-icon" translate="no">
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
    </button></h2><p>As bases de dados vectoriais têm uma vasta gama de aplicações em vários sectores, demonstrando a sua versatilidade e potência. Eis alguns casos de utilização notáveis:</p>
<ol>
<li><p><strong>Processamento de linguagem natural</strong>: No domínio do processamento de linguagem natural (PNL), as bases de dados vectoriais desempenham um papel crucial. São utilizadas para tarefas como a classificação de textos, a análise de sentimentos e a tradução de línguas. Ao converterem o texto em incorporações vectoriais de elevada dimensão, as bases de dados vectoriais permitem pesquisas de semelhança e compreensão semântica eficientes, melhorando o desempenho dos <a href="https://zilliz.com/learn/7-nlp-models">modelos de PNL</a>.</p></li>
<li><p><strong>Visão computacional</strong>: As bases de dados vectoriais são também amplamente utilizadas em aplicações de visão por computador. Tarefas como o reconhecimento de imagens, <a href="https://zilliz.com/learn/what-is-object-detection">a deteção de objectos</a> e a segmentação de imagens beneficiam da capacidade das bases de dados vectoriais para lidar com imagens de elevada dimensão. Isto permite a recuperação rápida e precisa de imagens visualmente semelhantes, tornando as bases de dados vectoriais indispensáveis em domínios como a condução autónoma, a imagiologia médica e a gestão de activos digitais.</p></li>
<li><p><strong>Genómica</strong>: Na genómica, as bases de dados vectoriais são utilizadas para armazenar e analisar sequências genéticas, estruturas proteicas e outros dados moleculares. A natureza altamente dimensional destes dados faz das bases de dados vectoriais a escolha ideal para gerir e consultar grandes conjuntos de dados genómicos. Os investigadores podem efetuar pesquisas vectoriais para encontrar sequências genéticas com padrões semelhantes, ajudando na descoberta de marcadores genéticos e na compreensão de processos biológicos complexos.</p></li>
<li><p><strong>Sistemas de recomendação</strong>: As bases de dados vectoriais são a pedra angular dos sistemas de recomendação modernos. Ao armazenar as interações dos utilizadores e as caraterísticas dos itens como ligações vectoriais, estas bases de dados podem identificar rapidamente itens semelhantes àqueles com que um utilizador interagiu anteriormente. Esta capacidade aumenta a precisão e a relevância das recomendações, melhorando a satisfação e o envolvimento do utilizador.</p></li>
<li><p><strong>Chatbots e assistentes virtuais</strong>: As bases de dados vectoriais são utilizadas em chatbots e assistentes virtuais para fornecer respostas contextuais em tempo real às perguntas dos utilizadores. Ao converter as entradas do utilizador em incorporações vectoriais, estes sistemas podem efetuar pesquisas de semelhança para encontrar as respostas mais relevantes. Isto permite que os chatbots e os assistentes virtuais forneçam respostas mais precisas e contextualmente adequadas, melhorando a experiência geral do utilizador.</p></li>
</ol>
<p>Ao tirar partido das capacidades únicas das bases de dados vectoriais, as organizações de vários sectores podem criar aplicações de IA mais inteligentes, reactivas e escaláveis.</p>
<h2 id="Vector-Search-Algorithms-From-Theory-to-Practice" class="common-anchor-header">Algoritmos de Pesquisa Vetorial: Da teoria à prática<button data-href="#Vector-Search-Algorithms-From-Theory-to-Practice" class="anchor-icon" translate="no">
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
    </button></h2><p>As bases de dados vectoriais requerem <a href="https://zilliz.com/learn/vector-index">algoritmos</a> de indexação especializados para permitir uma pesquisa de semelhanças eficiente em espaços de elevada dimensão. A seleção do algoritmo tem um impacto direto na precisão, velocidade, utilização de memória e escalabilidade.</p>
<h3 id="Graph-Based-Approaches" class="common-anchor-header">Abordagens baseadas em grafos</h3><p><strong>O HNSW (</strong><a href="https://zilliz.com/learn/hierarchical-navigable-small-worlds-HNSW"><strong>Hierarchical Navigable Small World</strong></a><strong>)</strong> cria estruturas navegáveis ligando vectores semelhantes, permitindo uma travessia eficiente durante a pesquisa. O HNSW limita o máximo de ligações por nó e o âmbito da pesquisa para equilibrar o desempenho e a precisão, tornando-o um dos algoritmos mais utilizados para a pesquisa de semelhanças vectoriais.</p>
<p><strong>O Cagra</strong> é um índice baseado em gráficos optimizado especificamente para aceleração de GPU. Constrói estruturas gráficas navegáveis que se alinham com os padrões de processamento da GPU, permitindo comparações vectoriais massivamente paralelas. O que torna a Cagra particularmente eficaz é a sua capacidade de equilibrar a recuperação e o desempenho através de parâmetros configuráveis, como o grau do gráfico e a largura da pesquisa. A utilização de GPUs de grau de inferência com a Cagra pode ser mais económica do que o dispendioso hardware de grau de treino, ao mesmo tempo que proporciona um elevado rendimento, especialmente para colecções de vectores em grande escala. No entanto, é importante notar que os índices de GPU como a Cagra podem não reduzir necessariamente a latência em comparação com os índices de CPU, a menos que operem sob alta pressão de consulta.</p>
<h3 id="Quantization-Techniques" class="common-anchor-header">Técnicas de quantização</h3><p><a href="https://zilliz.com/learn/scalar-quantization-and-product-quantization"><strong>A Quantização de produtos (PQ)</strong></a> decompõe vectores de elevada dimensão em subvectores mais pequenos, quantizando cada um separadamente. Isto reduz significativamente as necessidades de armazenamento (frequentemente em mais de 90%), mas introduz alguma perda de precisão.</p>
<p><strong>A Quantização escalar (SQ)</strong> converte os valores flutuantes de 32 bits em números inteiros de 8 bits, reduzindo a utilização de memória em 75% com um impacto mínimo na precisão.</p>
<h3 id="On-Disk-Indexing-Cost-Effective-Scaling" class="common-anchor-header">Indexação em disco: Escalonamento com boa relação custo-benefício</h3><p>Para coleções de vetores em grande escala (mais de 100 milhões de vetores), os índices na memória tornam-se proibitivamente caros. Por exemplo, 100 milhões de vetores de 1024 dimensões exigiriam aproximadamente 400 GB de RAM. É aqui que os algoritmos de indexação em disco, como o DiskANN, oferecem vantagens significativas em termos de custo.</p>
<p><a href="https://zilliz.com/learn/DiskANN-and-the-Vamana-Algorithm">O DiskANN</a>, baseado no algoritmo gráfico Vamana, permite uma pesquisa vetorial eficiente enquanto armazena a maior parte do índice em SSDs NVMe em vez de RAM. Essa abordagem oferece várias vantagens de custo:</p>
<ul>
<li><p><strong>Custos de hardware reduzidos</strong>: As organizações podem implantar a pesquisa vetorial em escala usando hardware de commodity com configurações modestas de RAM</p></li>
<li><p><strong>Despesas operacionais mais baixas</strong>: Menos RAM significa menor consumo de energia e custos de refrigeração nos centros de dados</p></li>
<li><p><strong>Escalonamento linear de custos</strong>: Os custos de memória escalam linearmente com o volume de dados, enquanto o desempenho permanece relativamente estável</p></li>
<li><p><strong>Padrões de E/S otimizados</strong>: O design especializado da DiskANN minimiza as leituras em disco por meio de estratégias cuidadosas de passagem de gráficos</p></li>
</ul>
<p>A compensação é normalmente um aumento modesto na latência da consulta (geralmente apenas 2-3 ms) em comparação com abordagens puramente na memória, o que é aceitável para muitos casos de uso de produção.</p>
<h3 id="Specialized-Index-Types" class="common-anchor-header">Tipos de índices especializados</h3><p><strong>Os índices de incorporação binária</strong> são especializados para visão computacional, impressão digital de imagens e sistemas de recomendação em que os dados podem ser representados como recursos binários. Estes índices servem diferentes necessidades de aplicação. Para a deduplicação de imagens, marcas de água digitais e deteção de direitos de autor, em que a correspondência exacta é fundamental, os índices binários optimizados proporcionam uma deteção precisa de semelhanças. Para sistemas de recomendação de alto rendimento, recuperação de imagens com base em conteúdo e correspondência de caraterísticas em grande escala, em que a velocidade é prioritária em relação à recuperação perfeita, os índices binários oferecem vantagens de desempenho excepcionais.</p>
<p><strong>Os índices vetoriais esparsos</strong> são otimizados para vetores em que a maioria dos elementos é zero, com apenas alguns valores diferentes de zero. Ao contrário dos vectores densos (em que a maioria ou todas as dimensões contêm valores significativos), os vectores esparsos representam eficientemente dados com muitas dimensões mas poucas caraterísticas activas. Esta representação é particularmente comum no processamento de texto, em que um documento pode utilizar apenas um pequeno subconjunto de todas as palavras possíveis num vocabulário. Os índices de vectores esparsos são excelentes em tarefas de processamento de linguagem natural, como a pesquisa semântica de documentos, a consulta de texto completo e a modelação de tópicos. Estes índices são particularmente valiosos para a pesquisa empresarial em grandes colecções de documentos, descoberta de documentos legais onde é necessário localizar eficientemente termos e conceitos específicos, e plataformas de investigação académica que indexam milhões de documentos com terminologia especializada.</p>
<h2 id="Advanced-Query-Capabilities" class="common-anchor-header">Capacidades de consulta avançadas<button data-href="#Advanced-Query-Capabilities" class="anchor-icon" translate="no">
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
    </button></h2><p>No centro das bases de dados vectoriais está a sua capacidade de efetuar pesquisas semânticas eficientes. As capacidades de pesquisa vetorial vão desde a correspondência de semelhança básica a técnicas avançadas para melhorar a relevância e a diversidade.</p>
<h3 id="Basic-ANN-Search" class="common-anchor-header">Pesquisa ANN básica</h3><p>A pesquisa ANN (Approximate Nearest Neighbor) é o método de pesquisa fundamental nas bases de dados vectoriais. Ao contrário da pesquisa exacta k-Nearest Neighbors (kNN), que compara um vetor de consulta com todos os vectores da base de dados, a pesquisa ANN utiliza estruturas de indexação para identificar rapidamente um subconjunto de vectores com maior probabilidade de serem mais semelhantes, melhorando drasticamente o desempenho.</p>
<p>Os principais componentes da pesquisa ANN incluem:</p>
<ul>
<li><p><strong>Vectores de consulta</strong>: A representação vetorial do que está a procurar</p></li>
<li><p><strong>Estruturas de índice</strong>: Estruturas de dados pré-construídas que organizam os vectores para uma recuperação eficiente</p></li>
<li><p><strong>Tipos de métricas</strong>: Funções matemáticas como Euclidean (L2), Cosine ou Inner Product que medem a semelhança entre vectores</p></li>
<li><p><strong>Resultados Top-K</strong>: O número especificado de vectores mais semelhantes a devolver</p></li>
</ul>
<p>As bases de dados vectoriais fornecem optimizações para melhorar a eficiência da pesquisa:</p>
<ul>
<li><p><strong>Pesquisa de vectores em massa</strong>: Pesquisa com vários vectores de consulta em paralelo</p></li>
<li><p><strong>Pesquisa particionada</strong>: Limitação da pesquisa a partições de dados específicas</p></li>
<li><p><strong>Paginação</strong>: Utilização de parâmetros de limite e deslocamento para obter grandes conjuntos de resultados</p></li>
<li><p><strong>Seleção do campo de saída</strong>: Controlo dos campos de entidade que são devolvidos com os resultados</p></li>
</ul>
<h3 id="Advanced-Search-Techniques" class="common-anchor-header">Técnicas de pesquisa avançadas</h3><h4 id="Range-Search" class="common-anchor-header">Pesquisa de intervalo</h4><p>A pesquisa de intervalo melhora a relevância dos resultados, restringindo os resultados a vectores com pontuações de semelhança dentro de um intervalo específico. Ao contrário da pesquisa ANN padrão que devolve os K vectores mais semelhantes, a pesquisa de intervalo define uma "região anular" utilizando:</p>
<ul>
<li><p>Um limite externo (raio) que define a distância máxima permitida</p></li>
<li><p>Um limite interno (range_filter) que pode excluir os vectores que são demasiado semelhantes</p></li>
</ul>
<p>Esta abordagem é particularmente útil quando se pretende encontrar itens "semelhantes mas não idênticos", tais como recomendações de produtos que estão relacionados mas não são duplicados exactos do que um utilizador já visualizou.</p>
<h4 id="Filtered-Search" class="common-anchor-header">Pesquisa filtrada</h4><p>A pesquisa filtrada combina a semelhança de vectores com restrições de metadados para limitar os resultados a vectores que correspondem a critérios específicos. Por exemplo, num catálogo de produtos, pode encontrar itens visualmente semelhantes, mas restringir os resultados a uma marca ou gama de preços específica.</p>
<p>As bases de dados vectoriais altamente dimensionáveis suportam duas abordagens de filtragem:</p>
<ul>
<li><p><strong>Filtragem padrão</strong>: Aplica filtros de metadados antes da pesquisa de vectores, reduzindo significativamente o conjunto de candidatos</p></li>
<li><p><strong>Filtragem iterativa</strong>: Executa primeiro a pesquisa vetorial e, em seguida, aplica filtros a cada resultado até atingir o número desejado de correspondências</p></li>
</ul>
<h4 id="Text-Match" class="common-anchor-header">Correspondência de texto</h4><p>A correspondência de texto permite a recuperação precisa de documentos com base em termos específicos, complementando a pesquisa por semelhança de vectores com capacidades de correspondência exacta de texto. Ao contrário da pesquisa semântica, que encontra conteúdo concetualmente semelhante, a correspondência de texto concentra-se em encontrar ocorrências exactas de termos de consulta.</p>
<p>Por exemplo, uma pesquisa de produtos pode combinar a correspondência de texto para encontrar produtos que mencionem explicitamente "à prova de água" com a semelhança de vectores para encontrar produtos visualmente semelhantes, assegurando que tanto a relevância semântica como os requisitos de caraterísticas específicas são cumpridos.</p>
<h4 id="Grouping-Search" class="common-anchor-header">Pesquisa de agrupamento</h4><p>A pesquisa de agrupamento agrega resultados por um campo específico para melhorar a diversidade de resultados. Por exemplo, numa coleção de documentos em que cada parágrafo é um vetor separado, o agrupamento garante que os resultados provêm de documentos diferentes e não de vários parágrafos do mesmo documento.</p>
<p>Esta técnica é valiosa para:</p>
<ul>
<li><p>Sistemas de recuperação de documentos em que se pretende uma representação de diferentes fontes</p></li>
<li><p>Sistemas de recomendação que precisam de apresentar diversas opções</p></li>
<li><p>Sistemas de pesquisa em que a diversidade de resultados é tão importante como a semelhança</p></li>
</ul>
<h4 id="Hybrid-Search" class="common-anchor-header">Pesquisa híbrida</h4><p>A pesquisa híbrida combina resultados de vários campos vectoriais, cada um representando potencialmente diferentes aspectos dos dados ou utilizando diferentes modelos de incorporação. Isto permite:</p>
<ul>
<li><p><strong>Combinações de vectores esparso-densos</strong>: Combinar a compreensão semântica (vectores densos) com a correspondência de palavras-chave (vectores esparsos) para uma pesquisa de texto mais abrangente</p></li>
<li><p><strong>Pesquisa multimodal</strong>: Encontrar correspondências entre diferentes tipos de dados, como a pesquisa de produtos utilizando entradas de imagem e de texto</p></li>
</ul>
<p>As implementações de pesquisa híbrida utilizam estratégias sofisticadas de classificação para combinar resultados:</p>
<ul>
<li><p><strong>Classificação ponderada</strong>: Dá prioridade aos resultados de campos vectoriais específicos</p></li>
<li><p><strong>Fusão de classificação recíproca</strong>: Equilibra os resultados em todos os campos vectoriais sem ênfase específica</p></li>
</ul>
<h4 id="Full-Text-Search" class="common-anchor-header">Pesquisa de texto integral</h4><p>As capacidades de pesquisa de texto integral nas bases de dados vectoriais modernas colmatam a lacuna entre a pesquisa de texto tradicional e a similaridade vetorial. Estes sistemas:</p>
<ul>
<li><p>Convertem automaticamente as consultas de texto em bruto em embeddings esparsos</p></li>
<li><p>Recuperam documentos que contêm termos ou frases específicos</p></li>
<li><p>Classificam os resultados com base na relevância do termo e na semelhança semântica</p></li>
<li><p>Complementam a pesquisa vetorial, detectando correspondências exactas que a pesquisa semântica pode não detetar</p></li>
</ul>
<p>Esta abordagem híbrida é particularmente valiosa para sistemas <a href="https://zilliz.com/learn/what-is-information-retrieval">de recuperação de informação</a> abrangentes que necessitam tanto de correspondência exacta de termos como de compreensão semântica.</p>
<h2 id="Performance-Engineering-Metrics-That-Matter" class="common-anchor-header">Engenharia de desempenho: Métricas importantes<button data-href="#Performance-Engineering-Metrics-That-Matter" class="anchor-icon" translate="no">
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
    </button></h2><p>A otimização do desempenho em bases de dados vectoriais requer a compreensão das principais métricas e das suas soluções de compromisso.</p>
<h3 id="The-Recall-Throughput-Tradeoff" class="common-anchor-header">A troca entre recuperação e taxa de transferência</h3><p>A recuperação mede a proporção de vizinhos mais próximos verdadeiros encontrados entre os resultados retornados. Uma maior recuperação requer uma pesquisa mais extensa, reduzindo a taxa de transferência (consultas por segundo). Os sistemas de produção equilibram essas métricas com base nos requisitos da aplicação, geralmente visando 80-99% de recuperação, dependendo do caso de uso.</p>
<p>Ao avaliar o desempenho da base de dados de vectores, os ambientes de benchmarking padronizados, como o ANN-Benchmarks, fornecem dados comparativos valiosos. Essas ferramentas medem métricas críticas, incluindo:</p>
<ul>
<li><p>Recuperação de pesquisa: A proporção de consultas para as quais os verdadeiros vizinhos mais próximos são encontrados entre os resultados retornados</p></li>
<li><p>Consultas por segundo (QPS): A taxa a que a base de dados processa as consultas em condições padronizadas</p></li>
<li><p>Desempenho em diferentes tamanhos e dimensões de conjuntos de dados</p></li>
</ul>
<p>Uma alternativa é um sistema de benchmark de código aberto chamado <a href="https://zilliz.com/vector-database-benchmark-tool?database=ZillizCloud%2CMilvus%2CElasticCloud%2CPgVector%2CPinecone%2CQdrantCloud%2CWeaviateCloud&amp;dataset=medium&amp;filter=none%2Clow%2Chigh&amp;tab=1">VDB Bench</a>. O VectorDBBench é uma <a href="https://github.com/zilliztech/VectorDBBench">ferramenta de benchmarking de código aberto</a> concebida para avaliar e comparar o desempenho das principais bases de dados vectoriais, como o Milvus e o Zilliz Cloud, utilizando os seus próprios conjuntos de dados. Também ajuda os programadores a escolher a base de dados vetorial mais adequada para os seus casos de utilização.</p>
<p>Estas referências permitem que as organizações identifiquem a implementação de base de dados vetorial mais adequada para os seus requisitos específicos, considerando o equilíbrio entre precisão, velocidade e escalabilidade.</p>
<h3 id="Memory-Management" class="common-anchor-header">Gerenciamento de memória</h3><p>A gestão eficiente da memória permite que as bases de dados vectoriais sejam dimensionadas para milhares de milhões de vectores, mantendo o desempenho:</p>
<ul>
<li><p><strong>A alocação dinâmica</strong> ajusta a utilização da memória com base nas caraterísticas da carga de trabalho</p></li>
<li><p><strong>As políticas de armazenamento em cache</strong> retêm na memória os vectores frequentemente acedidos</p></li>
<li><p><strong>As técnicas de compressão de vectores</strong> reduzem significativamente os requisitos de memória</p></li>
</ul>
<p>Para conjuntos de dados que excedem a capacidade da memória, as soluções baseadas em disco fornecem uma capacidade crucial. Estes algoritmos optimizam os padrões de E/S para SSDs NVMe através de técnicas como a pesquisa de feixes e a navegação baseada em gráficos.</p>
<h3 id="Advanced-Filtering-and-Hybrid-Search" class="common-anchor-header">Filtragem avançada e pesquisa híbrida</h3><p>As bases de dados vectoriais combinam a semelhança semântica com a filtragem tradicional para criar poderosas capacidades de consulta:</p>
<ul>
<li><p><strong>A pré-filtragem</strong> aplica restrições de metadados antes da pesquisa vetorial, reduzindo o conjunto de candidatos para comparação de similaridade</p></li>
<li><p><strong>A pós-filtragem</strong> executa primeiro a pesquisa vetorial e, em seguida, aplica filtros aos resultados</p></li>
<li><p><strong>A indexação de metadados</strong> melhora o desempenho da filtragem através de índices especializados para diferentes tipos de dados</p></li>
</ul>
<p>As bases de dados vectoriais de elevado desempenho suportam padrões de consulta complexos que combinam vários campos vectoriais com restrições escalares. As consultas multi-vectoriais encontram entidades semelhantes a vários pontos de referência em simultâneo, enquanto as consultas vectoriais negativas excluem vectores semelhantes a exemplos especificados.</p>
<h2 id="Scaling-Vector-Databases-in-Production" class="common-anchor-header">Dimensionamento de bancos de dados vetoriais na produção<button data-href="#Scaling-Vector-Databases-in-Production" class="anchor-icon" translate="no">
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
    </button></h2><p>Os bancos de dados vetoriais exigem estratégias de implantação bem pensadas para garantir o desempenho ideal em diferentes escalas:</p>
<ul>
<li><p><strong>As implementações de pequena escala</strong> (milhões de vectores) podem funcionar eficazmente numa única máquina com memória suficiente</p></li>
<li><p><strong>Implantações de média escala</strong> (dezenas a centenas de milhões) se beneficiam do escalonamento vertical com instâncias de alta memória e armazenamento SSD</p></li>
<li><p><strong>As implementações à escala de milhares de milhões</strong> requerem um escalonamento horizontal em vários nós com funções especializadas</p></li>
</ul>
<p>A fragmentação e a replicação formam a base da arquitetura da base de dados vetorial escalável:</p>
<ul>
<li><p>A<strong>fragmentação horizontal</strong> divide as colecções em vários nós</p></li>
<li><p><strong>A replicação</strong> cria cópias redundantes de dados, melhorando a tolerância a falhas e a taxa de transferência de consultas</p></li>
</ul>
<p>Os sistemas modernos ajustam dinamicamente os factores de replicação com base nos padrões de consulta e nos requisitos de fiabilidade.</p>
<h2 id="Real-World-Impact" class="common-anchor-header">Impacto no mundo real<button data-href="#Real-World-Impact" class="anchor-icon" translate="no">
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
    </button></h2><p>A flexibilidade das bases de dados vectoriais de elevado desempenho é evidente nas suas opções de implementação. Os sistemas podem ser executados num espetro de ambientes, desde instalações leves em computadores portáteis para prototipagem até clusters distribuídos maciços que gerem dezenas de milhares de milhões de vectores. Esta escalabilidade permitiu que as organizações passassem do conceito à produção sem alterar as tecnologias de bases de dados.</p>
<p>Empresas como Salesforce, PayPal, eBay, NVIDIA, IBM e Airbnb agora contam com bancos de dados vetoriais como o <a href="https://milvus.io/">Milvus</a> de código aberto para alimentar aplicativos de IA em grande escala. Essas implementações abrangem diversos casos de uso - desde sistemas sofisticados de recomendação de produtos até moderação de conteúdo, deteção de fraude e automação de suporte ao cliente - todos construídos sobre a base da pesquisa vetorial.</p>
<p>Nos últimos anos, as bases de dados vectoriais tornaram-se vitais para resolver os problemas de alucinação comuns nos LLMs, fornecendo dados específicos do domínio, actualizados ou confidenciais. Por exemplo, <a href="https://zilliz.com/cloud">o Zilliz Cloud</a> armazena dados especializados como embeddings vectoriais. Quando um utilizador faz uma pergunta, transforma a consulta em vectores, efectua pesquisas ANN para obter os resultados mais relevantes e combina-os com a pergunta original para criar um contexto abrangente para os grandes modelos de linguagem. Esta estrutura serve de base para o desenvolvimento de aplicações fiáveis alimentadas por LLM que produzem respostas mais precisas e contextualmente relevantes.</p>
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
    </button></h2><p>O surgimento das bases de dados vectoriais representa mais do que apenas uma nova tecnologia - significa uma mudança fundamental na forma como abordamos a gestão de dados para aplicações de IA. Ao colmatar a lacuna entre os dados não estruturados e os sistemas computacionais, as bases de dados vectoriais tornaram-se um componente essencial da moderna infraestrutura de IA, permitindo aplicações que compreendem e processam a informação de forma cada vez mais humana.</p>
<p>As principais vantagens das bases de dados vectoriais em relação aos sistemas de bases de dados tradicionais incluem:</p>
<ul>
<li><p>Pesquisa de alta dimensão: Pesquisas de semelhança eficientes em vectores de elevada dimensão utilizados em aplicações de aprendizagem automática e de IA generativa</p></li>
<li><p>Escalabilidade: Escalonamento horizontal para armazenamento e recuperação eficientes de grandes colecções de vectores</p></li>
<li><p>Flexibilidade com pesquisa híbrida: Manipulação de vários tipos de dados vectoriais, incluindo vectores esparsos e densos</p></li>
<li><p>Desempenho: Pesquisas de similaridade de vetores significativamente mais rápidas em comparação com bancos de dados tradicionais</p></li>
<li><p>Indexação personalizável: Suporte para esquemas de indexação personalizados optimizados para casos de utilização e tipos de dados específicos</p></li>
</ul>
<p>À medida que as aplicações de IA se tornam cada vez mais sofisticadas, as exigências das bases de dados vectoriais continuam a evoluir. Os sistemas modernos devem equilibrar desempenho, precisão, dimensionamento e custo-benefício, integrando-se perfeitamente ao ecossistema de IA mais amplo. Para organizações que buscam implementar a IA em escala, entender a tecnologia de banco de dados vetorial não é apenas uma consideração técnica - é um imperativo estratégico.</p>
