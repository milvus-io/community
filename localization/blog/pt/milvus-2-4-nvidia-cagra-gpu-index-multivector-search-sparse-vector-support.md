---
id: milvus-2-4-nvidia-cagra-gpu-index-multivector-search-sparse-vector-support.md
title: >-
  Revelação do Milvus 2.4: Pesquisa multi-vetorial, vetor esparso, índice CAGRA
  e muito mais!
author: Fendy Feng
date: 2024-3-20
desc: >-
  Temos o prazer de anunciar o lançamento do Milvus 2.4, um grande avanço na
  melhoria das capacidades de pesquisa para conjuntos de dados em grande escala.
metaTitle: 'Milvus 2.4 Supports Multi-vector Search, Sparse Vector, CAGRA, and More!'
cover: assets.zilliz.com/What_is_new_in_Milvus_2_4_1_c580220be3.png
tag: Engineering
tags: >-
  Data science, Database, Tech, Artificial Intelligence, Vector Management,
  Milvus
recommend: true
canonicalUrl: >-
  https://milvus.io/blog/milvus-2-4-nvidia-cagra-gpu-index-multivector-search-sparse-vector-support.md
---
<p>Temos o prazer de anunciar o lançamento do Milvus 2.4, um grande avanço no aprimoramento dos recursos de pesquisa para conjuntos de dados em grande escala. Esta última versão adiciona novos recursos, como suporte para o índice CAGRA baseado em GPU, suporte beta para <a href="https://zilliz.com/learn/sparse-and-dense-embeddings">embeddings esparsos</a>, pesquisa em grupo e várias outras melhorias nos recursos de pesquisa. Estes desenvolvimentos reforçam o nosso compromisso para com a comunidade, oferecendo a programadores como você uma ferramenta poderosa e eficiente para o tratamento e consulta de dados vectoriais. Vamos ver juntos os principais benefícios do Milvus 2.4.</p>
<h2 id="Enabled-Multi-vector-Search-for-Simplified-Multimodal-Searches" class="common-anchor-header">Pesquisa multi-vetorial activada para pesquisas multimodais simplificadas<button data-href="#Enabled-Multi-vector-Search-for-Simplified-Multimodal-Searches" class="anchor-icon" translate="no">
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
    </button></h2><p>O Milvus 2.4 oferece a capacidade de pesquisa multivectorial, permitindo a pesquisa simultânea e a classificação de diferentes tipos de vectores dentro do mesmo sistema Milvus. Esta funcionalidade simplifica as pesquisas multimodais, melhorando significativamente as taxas de recuperação e permitindo aos programadores gerir sem esforço aplicações de IA complexas com tipos de dados variados. Além disso, essa funcionalidade simplifica a integração e o ajuste fino de modelos de reranking personalizados, auxiliando na criação de funções de pesquisa avançadas, como <a href="https://zilliz.com/vector-database-use-cases/recommender-system">sistemas de recomendação</a> precisos que utilizam insights de dados multidimensionais.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/How_the_multi_vector_search_feature_works_6c85961349.png" alt="How the Milti-Vector Search Feature Works" class="doc-image" id="how-the-milti-vector-search-feature-works" />
   </span> <span class="img-wrapper"> <span>Como funciona a funcionalidade de pesquisa milti-vetorial</span> </span></p>
<p>O suporte multivectorial em Milvus tem dois componentes:</p>
<ol>
<li><p>A capacidade de armazenar/pesquisar múltiplos vectores para uma única entidade dentro de uma coleção, que é uma forma mais natural de organizar dados</p></li>
<li><p>A capacidade de construir/otimizar um algoritmo de reranking, aproveitando os algoritmos de reranking pré-construídos em Milvus</p></li>
</ol>
<p>Para além de ser uma funcionalidade muito <a href="https://github.com/milvus-io/milvus/issues/25639">solicitada</a>, criámos esta capacidade porque a indústria está a avançar para modelos multimodais com o lançamento do GPT-4 e do Claude 3. O ranqueamento é uma técnica comumente usada para melhorar ainda mais o desempenho da consulta na pesquisa. O nosso objetivo foi facilitar aos programadores a criação e otimização dos seus rerankers no ecossistema Milvus.</p>
<h2 id="Grouping-Search-Support-for-Enhanced-Compute-Efficiency" class="common-anchor-header">Suporte à pesquisa de agrupamento para maior eficiência computacional<button data-href="#Grouping-Search-Support-for-Enhanced-Compute-Efficiency" class="anchor-icon" translate="no">
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
    </button></h2><p>A pesquisa de agrupamento é outra <a href="https://github.com/milvus-io/milvus/issues/25343">funcionalidade</a> frequentemente <a href="https://github.com/milvus-io/milvus/issues/25343">solicitada</a> que adicionámos ao Milvus 2.4. Integra uma operação de agrupamento concebida para campos dos tipos BOOL, INT ou VARCHAR, preenchendo uma lacuna crucial de eficiência na execução de consultas de agrupamento em grande escala.</p>
<p>Tradicionalmente, os programadores baseavam-se em pesquisas Top-K extensas seguidas de pós-processamento manual para destilar resultados específicos do grupo, um método de computação intensiva e de código pesado. A Pesquisa de Agrupamento aperfeiçoa este processo ligando eficazmente os resultados das consultas a identificadores de grupos agregados, como nomes de documentos ou vídeos, simplificando o tratamento de entidades segmentadas em conjuntos de dados maiores.</p>
<p>A Milvus distingue a sua Pesquisa de Agrupamento com uma implementação baseada em iteradores, oferecendo uma melhoria acentuada na eficiência computacional em relação a tecnologias semelhantes. Esta escolha garante uma escalabilidade de desempenho superior, particularmente em ambientes de produção onde a otimização dos recursos de computação é fundamental. Ao reduzir a passagem de dados e a sobrecarga de computação, o Milvus suporta um processamento de consultas mais eficiente, reduzindo significativamente os tempos de resposta e os custos operacionais em comparação com outras bases de dados vectoriais.</p>
<p>O Grouping Search reforça a capacidade do Milvus de gerir consultas complexas e de elevado volume e alinha-se com as práticas de computação de elevado desempenho para soluções robustas de gestão de dados.</p>
<h2 id="Beta-Support-for-Sparse-Vector-Embeddings" class="common-anchor-header">Suporte Beta para Embeddings de Vectores Esparsos<button data-href="#Beta-Support-for-Sparse-Vector-Embeddings" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://zilliz.com/learn/sparse-and-dense-embeddings">As inc</a> orporações esparsas representam uma mudança de paradigma em relação às abordagens tradicionais de vetores densos, atendendo às nuances da similaridade semântica em vez da mera frequência de palavras-chave. Esta distinção permite uma capacidade de pesquisa com mais nuances, alinhando-se estreitamente com o conteúdo semântico da consulta e dos documentos. Os modelos vectoriais esparsos, particularmente úteis na recuperação de informação e no processamento de linguagem natural, oferecem poderosas capacidades de pesquisa fora do domínio e interpretabilidade em comparação com os seus homólogos densos.</p>
<p>No Milvus 2.4, expandimos a Pesquisa Híbrida para incluir embeddings esparsos gerados por modelos neurais avançados como o SPLADEv2 ou modelos estatísticos como o BM25. No Milvus, os vectores esparsos são tratados em pé de igualdade com os vectores densos, permitindo a criação de colecções com campos vectoriais esparsos, a inserção de dados, a construção de índices e a realização de pesquisas de semelhança. Em particular, os embeddings esparsos em Milvus suportam a métrica de distância <a href="https://zilliz.com/blog/similarity-metrics-for-vector-search#Inner-Product">Inner Product</a> (IP), o que é vantajoso dada a sua natureza de alta dimensão, tornando outras métricas menos eficazes. Esta funcionalidade também suporta tipos de dados com uma dimensão como um inteiro de 32 bits sem sinal e um float de 32 bits para o valor, facilitando assim um vasto espetro de aplicações, desde pesquisas de texto com nuances a sistemas elaborados de <a href="https://zilliz.com/learn/information-retrieval-metrics">recuperação de informação</a>.</p>
<p>Com esta nova funcionalidade, o Milvus permite metodologias de pesquisa híbridas que combinam palavras-chave e técnicas baseadas em incorporação, oferecendo uma transição perfeita para os utilizadores que se deslocam de estruturas de pesquisa centradas em palavras-chave que procuram uma solução abrangente e de baixa manutenção.</p>
<p>Estamos a classificar esta funcionalidade como "Beta" para continuar os nossos testes de desempenho da funcionalidade e recolher feedback da comunidade. A disponibilidade geral (GA) do suporte a vetores esparsos está prevista para o lançamento do Milvus 3.0.</p>
<h2 id="CAGRA-Index-Support-for-Advanced-GPU-Accelerated-Graph-Indexing" class="common-anchor-header">Suporte ao índice CAGRA para indexação avançada de gráficos acelerada por GPU<button data-href="#CAGRA-Index-Support-for-Advanced-GPU-Accelerated-Graph-Indexing" class="anchor-icon" translate="no">
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
    </button></h2><p>Desenvolvida pela NVIDIA, <a href="https://arxiv.org/abs/2308.15136">a CAGRA</a> (Cuda Anns GRAph-based) é uma tecnologia de indexação de gráficos baseada em GPU que supera significativamente os métodos tradicionais baseados em CPU, como o índice HNSW, em termos de eficiência e desempenho, especialmente em ambientes de alto rendimento.</p>
<p>Com a introdução do índice CAGRA, o Milvus 2.4 fornece uma capacidade aprimorada de indexação de gráficos acelerada por GPU. Esse aprimoramento é ideal para a criação de aplicativos de pesquisa de similaridade que exigem latência mínima. Além disso, o Milvus 2.4 integra uma pesquisa de força bruta com o índice CAGRA para atingir taxas máximas de recuperação em aplicativos. Para obter informações detalhadas, explore o <a href="https://zilliz.com/blog/Milvus-introduces-GPU-index-CAGRA">blogue de introdução ao CAGRA</a>.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Milvus_raft_cagra_vs_milvus_hnsw_ffe0415ff5.png" alt="Milvus Raft CAGRA vs. Milvus HNSW" class="doc-image" id="milvus-raft-cagra-vs.-milvus-hnsw" />
   </span> <span class="img-wrapper"> <span>Milvus Raft CAGRA vs. Milvus HNSW</span> </span></p>
<h2 id="Additional-Enhancements-and-Features" class="common-anchor-header">Melhorias e recursos adicionais<button data-href="#Additional-Enhancements-and-Features" class="anchor-icon" translate="no">
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
    </button></h2><p>O Milvus 2.4 também inclui outras melhorias importantes, como o suporte a expressões regulares para melhorar a correspondência de substring na <a href="https://zilliz.com/blog/metadata-filtering-with-zilliz-cloud-pipelines">filtragem de metadados</a>, um novo índice escalar invertido para uma filtragem eficiente de tipos de dados escalares e uma ferramenta de captura de dados de alterações para monitorizar e replicar alterações em colecções Milvus. Estas actualizações melhoram coletivamente o desempenho e a versatilidade do Milvus, tornando-o uma solução abrangente para operações de dados complexas.</p>
<p>Para obter mais detalhes, consulte <a href="https://milvus.io/docs/release_notes.md">a documentação do Milvus 2.4</a>.</p>
<h2 id="Stay-Connected" class="common-anchor-header">Fique ligado!<button data-href="#Stay-Connected" class="anchor-icon" translate="no">
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
    </button></h2><p>Ansioso para saber mais sobre o Milvus 2.4? <a href="https://zilliz.com/event/unlocking-advanced-search-capabilities-milvus">Participe no nosso próximo webinar</a> com James Luan, VP de Engenharia da Zilliz, para uma discussão aprofundada sobre as capacidades desta última versão. Se tiver dúvidas ou comentários, junte-se ao nosso <a href="https://discord.com/invite/8uyFbECzPX">canal Discord</a> para interagir com os nossos engenheiros e membros da comunidade. Não se esqueça de nos seguir no <a href="https://twitter.com/milvusio">Twitter</a> ou no <a href="https://www.linkedin.com/company/the-milvus-project">LinkedIn</a> para obter as últimas notícias e actualizações sobre o Milvus.</p>
