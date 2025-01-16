---
id: elasticsearch-is-dead-long-live-lexical-search.md
title: 'O Elasticsearch está morto, viva a pesquisa lexical'
author: James Luan
date: 2024-12-17T00:00:00.000Z
cover: >-
  assets.zilliz.com/Elasticsearch_is_Dead_Long_Live_Lexical_Search_0fa15cd6d7.png
tag: Engineering
tags: Milvus
recommend: false
canonicalUrl: 'https://milvus.io/blog/elasticsearch-is-dead-long-live-lexical-search.md'
---
<p>Neste momento, toda a gente sabe que a pesquisa híbrida melhorou a qualidade da pesquisa <a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">RAG</a> (Retrieval-Augmented Generation). Embora a pesquisa <a href="https://zilliz.com/learn/sparse-and-dense-embeddings">com incorporação densa</a> tenha mostrado capacidades impressionantes na captura de relações semânticas profundas entre consultas e documentos, ainda tem limitações notáveis. Estas incluem a falta de explicabilidade e um desempenho subóptimo com consultas de cauda longa e termos raros.</p>
<p>Muitas aplicações RAG têm dificuldades porque os modelos pré-treinados carecem frequentemente de conhecimentos específicos do domínio. Em alguns cenários, a simples correspondência de palavras-chave BM25 supera estes modelos sofisticados. É aqui que a pesquisa híbrida preenche a lacuna, combinando a compreensão semântica da recuperação de vectores densos com a precisão da correspondência de palavras-chave.</p>
<h2 id="Why-Hybrid-Search-is-Complex-in-Production" class="common-anchor-header">Porque é que a pesquisa híbrida é complexa na produção<button data-href="#Why-Hybrid-Search-is-Complex-in-Production" class="anchor-icon" translate="no">
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
    </button></h2><p>Embora estruturas como <a href="https://zilliz.com/learn/LangChain">LangChain</a> ou <a href="https://zilliz.com/learn/getting-started-with-llamaindex">LlamaIndex</a> facilitem a construção de um recuperador híbrido de prova de conceito, o escalonamento para produção com conjuntos de dados massivos é um desafio. As arquitecturas tradicionais requerem bases de dados vectoriais e motores de pesquisa separados, o que leva a vários desafios importantes:</p>
<ul>
<li><p>Elevados custos de manutenção da infraestrutura e complexidade operacional</p></li>
<li><p>Redundância de dados em vários sistemas</p></li>
<li><p>Gestão difícil da consistência dos dados</p></li>
<li><p>Segurança e controlo de acesso complexos entre sistemas</p></li>
</ul>
<p>O mercado precisa de uma solução unificada que suporte a pesquisa lexical e semântica, reduzindo a complexidade e o custo do sistema.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/elasticsearch_vs_milvus_5be6e2b69e.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="The-Pain-Points-of-Elasticsearch" class="common-anchor-header">Os pontos problemáticos do Elasticsearch<button data-href="#The-Pain-Points-of-Elasticsearch" class="anchor-icon" translate="no">
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
    </button></h2><p>O Elasticsearch tem sido um dos projectos de pesquisa open-source mais influentes da última década. Criado com base no Apache Lucene, ganhou popularidade graças ao seu elevado desempenho, escalabilidade e arquitetura distribuída. Embora tenha adicionado a pesquisa ANN vetorial na versão 8.0, as implementações de produção enfrentam vários desafios críticos:</p>
<p><strong>Altos custos de atualização e indexação:</strong> A arquitetura do Elasticsearch não dissocia totalmente as operações de gravação, a criação de índices e a consulta. Isso leva a uma sobrecarga significativa de CPU e E/S durante as operações de gravação, especialmente em atualizações em massa. A contenção de recursos entre a indexação e a consulta afeta o desempenho, criando um grande gargalo para cenários de atualização de alta frequência.</p>
<p><strong>Fraco desempenho em tempo real:</strong> Como um mecanismo de busca "quase em tempo real", o Elasticsearch introduz uma latência percetível na visibilidade dos dados. Essa latência se torna particularmente problemática para aplicações de IA, como sistemas Agent, em que interações de alta frequência e tomadas de decisão dinâmicas exigem acesso imediato aos dados.</p>
<p><strong>Difícil gerenciamento de shards:</strong> Embora o Elasticsearch use sharding para arquitetura distribuída, o gerenciamento de shards apresenta desafios significativos. A falta de suporte a sharding dinâmico cria um dilema: muitos shards em conjuntos de dados pequenos levam a um desempenho ruim, enquanto poucos shards em conjuntos de dados grandes limitam a escalabilidade e causam distribuição desigual de dados.</p>
<p><strong>Arquitetura não nativa da nuvem:</strong> Desenvolvido antes de as arquiteturas nativas da nuvem se tornarem predominantes, o design do Elasticsearch une fortemente o armazenamento e a computação, limitando sua integração com a infraestrutura moderna, como nuvens públicas e Kubernetes. A ampliação de recursos exige aumentos simultâneos no armazenamento e na computação, reduzindo a flexibilidade. Em cenários de várias réplicas, cada fragmento deve criar seu índice de forma independente, aumentando os custos computacionais e reduzindo a eficiência dos recursos.</p>
<p><strong>Baixo desempenho de pesquisa vetorial:</strong> Embora o Elasticsearch 8.0 tenha introduzido a pesquisa vetorial ANN, seu desempenho fica significativamente atrás do desempenho de mecanismos vetoriais dedicados, como o Milvus. Com base no kernel do Lucene, sua estrutura de índice se mostra ineficiente para dados de alta dimensão, com dificuldades para atender aos requisitos de busca vetorial em grande escala. O desempenho torna-se particularmente instável em cenários complexos que envolvem filtragem escalar e multi-tenancy, o que torna difícil suportar cargas elevadas ou necessidades empresariais diversas.</p>
<p><strong>Consumo excessivo de recursos:</strong> O Elasticsearch impõe demandas extremas de memória e CPU, especialmente ao processar dados em grande escala. Sua dependência da JVM exige ajustes frequentes no tamanho do heap e no ajuste da coleta de lixo, afetando severamente a eficiência da memória. As operações de pesquisa vetorial exigem cálculos intensivos otimizados para SIMD, para os quais o ambiente JVM está longe de ser ideal.</p>
<p>Essas limitações fundamentais se tornam cada vez mais problemáticas à medida que as organizações ampliam sua infraestrutura de IA, tornando o Elasticsearch particularmente desafiador para aplicações modernas de IA que exigem alto desempenho e confiabilidade.</p>
<h2 id="Introducing-Sparse-BM25-Reimagining-Lexical-Search" class="common-anchor-header">Apresentando o Sparse-BM25: Reimaginando a pesquisa lexical<button data-href="#Introducing-Sparse-BM25-Reimagining-Lexical-Search" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://milvus.io/blog/introduce-milvus-2-5-full-text-search-powerful-metadata-filtering-and-more.md">O Milvus 2.5</a> introduz o suporte nativo à pesquisa lexical por meio do Sparse-BM25, com base nos recursos de pesquisa híbrida introduzidos na versão 2.4. Essa abordagem inovadora inclui os seguintes componentes principais:</p>
<ul>
<li><p>Tokenização avançada e pré-processamento via Tantivy</p></li>
<li><p>Gestão distribuída do vocabulário e da frequência dos termos</p></li>
<li><p>Geração de vectores esparsos utilizando TF do corpus e TF-IDF da consulta</p></li>
<li><p>Suporte a índices invertidos com o algoritmo WAND (Block-Max WAND e suporte a índices gráficos em desenvolvimento)</p></li>
</ul>
<p>Em comparação com o Elasticsearch, o Milvus oferece vantagens significativas em termos de flexibilidade de algoritmos. O seu cálculo de semelhança baseado na distância vetorial permite uma correspondência mais sofisticada, incluindo a implementação do TW-BERT (Term Weighting BERT) com base na investigação "End-to-End Query Term Weighting". Esta abordagem demonstrou um desempenho superior em testes no domínio e fora do domínio.</p>
<p>Outra vantagem crucial é a eficiência de custos. Ao tirar partido do índice invertido e da compressão de incorporação densa, o Milvus consegue quintuplicar o desempenho com menos de 1% de degradação da recuperação. Através da poda de cauda e da quantização de vectores, a utilização de memória foi reduzida em mais de 50%.</p>
<p>A otimização de consultas longas destaca-se como um ponto forte particular. Enquanto os algoritmos WAND tradicionais têm dificuldades com consultas mais longas, o Milvus se destaca pela combinação de embeddings esparsos com índices gráficos, proporcionando uma melhoria de desempenho dez vezes maior em cenários de pesquisa de vetores esparsos de alta dimensão.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/document_in_and_out_b84771bec4.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Milvus-The-Ultimate-Vector-Database-for-RAG" class="common-anchor-header">Milvus: A melhor base de dados vetorial para RAG<button data-href="#Milvus-The-Ultimate-Vector-Database-for-RAG" class="anchor-icon" translate="no">
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
    </button></h2><p>O Milvus é a primeira escolha para aplicações RAG graças ao seu conjunto abrangente de funcionalidades. As principais vantagens incluem:</p>
<ul>
<li><p>Suporte rico de metadados com capacidades de esquema dinâmico e opções de filtragem poderosas</p></li>
<li><p>Multitenancy de nível empresarial com isolamento flexível através de colecções, partições e chaves de partição</p></li>
<li><p>Suporte de índice de vetor de disco pioneiro no setor com armazenamento em vários níveis, da memória ao S3</p></li>
<li><p>Escalabilidade nativa da nuvem com suporte para escalonamento contínuo de 10 milhões a mais de 1 bilhão de vetores</p></li>
<li><p>Recursos de pesquisa abrangentes, incluindo agrupamento, intervalo e pesquisa híbrida</p></li>
<li><p>Integração profunda do ecossistema com LangChain, LlamaIndex, Dify e outras ferramentas de IA</p></li>
</ul>
<p>As diversas capacidades de pesquisa do sistema abrangem metodologias de pesquisa de agrupamento, de intervalo e híbridas. A profunda integração com ferramentas como LangChain, LlamaIndex e Dify, bem como o suporte a vários produtos de IA, coloca o Milvus no centro do ecossistema moderno de infraestrutura de IA.</p>
<h2 id="Looking-Forward" class="common-anchor-header">Olhando para o futuro<button data-href="#Looking-Forward" class="anchor-icon" translate="no">
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
    </button></h2><p>À medida que a IA passa do POC para a produção, a Milvus continua a evoluir. Concentramo-nos em tornar a pesquisa vetorial mais acessível e rentável, melhorando simultaneamente a qualidade da pesquisa. Quer se trate de uma startup ou de uma empresa, a Milvus reduz as barreiras técnicas ao desenvolvimento de aplicações de IA.</p>
<p>Este compromisso com a acessibilidade e a inovação levou-nos a dar mais um grande passo em frente. Embora a nossa solução de código aberto continue a servir de base a milhares de aplicações em todo o mundo, reconhecemos que muitas organizações necessitam de uma solução totalmente gerida que elimine as despesas operacionais.</p>
<h2 id="Zilliz-Cloud-The-Managed-Solution" class="common-anchor-header">Zilliz Cloud: A Solução Gerenciada<button data-href="#Zilliz-Cloud-The-Managed-Solution" class="anchor-icon" translate="no">
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
    </button></h2><p>Nos últimos três anos, criámos <a href="https://zilliz.com/cloud">o Zilliz Cloud</a>, um serviço de base de dados vetorial totalmente gerido, baseado no Milvus. Através de uma reimplementação nativa da nuvem do protocolo Milvus, oferece maior usabilidade, eficiência de custos e segurança.</p>
<p>Com base na nossa experiência na manutenção dos maiores clusters de pesquisa vetorial do mundo e no suporte a milhares de programadores de aplicações de IA, o Zilliz Cloud reduz significativamente as despesas gerais e os custos operacionais em comparação com as soluções auto-hospedadas.</p>
<p>Pronto para experimentar o futuro da pesquisa vetorial? Comece hoje mesmo a sua avaliação gratuita com até $200 em créditos, sem necessidade de cartão de crédito.</p>
