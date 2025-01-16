---
id: 2022-08-05-whats-new-in-milvus-2-1.md
title: O que há de novo no Milvus 2.1 - Em direção à simplicidade e à rapidez
author: Xiaofan Luan
date: 2022-08-05T00:00:00.000Z
desc: >-
  Milvus, a base de dados vetorial de código aberto, apresenta agora melhorias
  de desempenho e de usabilidade que os utilizadores há muito esperavam.
cover: assets.zilliz.com/What_s_New_in_2_1_2_a0660df2a5.png
tag: News
canonicalUrl: 'https://milvus.io/blog/2022-08-05-whats-new-in-milvus-2-1.md'
---
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/What_s_New_in_2_1_2_a0660df2a5.png" alt="What's new in Milvus 2.1 - Towards simplicity and speed" class="doc-image" id="what's-new-in-milvus-2.1---towards-simplicity-and-speed" />
   </span> <span class="img-wrapper"> <span>O que há de novo no Milvus 2.1 - Em direção à simplicidade e à velocidade</span> </span></p>
<p>Temos o prazer de anunciar que o<a href="https://milvus.io/docs/v2.1.x/release_notes.md">lançamento</a> do Milvus 2.1 já está disponível, após seis meses de trabalho árduo de todos os colaboradores da nossa comunidade Milvus. Esta grande iteração da popular base de dados vetorial enfatiza <strong>o desempenho</strong> e <strong>a usabilidade</strong>, duas das palavras-chave mais importantes do nosso foco. Adicionámos suporte para strings, fila de mensagens Kafka e Milvus incorporado, bem como uma série de melhorias no desempenho, escalabilidade, segurança e observabilidade. O Milvus 2.1 é uma atualização empolgante que fará a ponte entre a "última milha" do portátil do engenheiro de algoritmos e os serviços de pesquisa de semelhanças vectoriais ao nível da produção.</p>
<custom-h1>Desempenho - Mais do que um aumento de 3,2x</custom-h1><h2 id="5ms-level-latency" class="common-anchor-header">Latência de 5ms<button data-href="#5ms-level-latency" class="anchor-icon" translate="no">
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
    </button></h2><p>O Milvus já suporta a pesquisa do vizinho mais próximo aproximado (ANN), um salto substancial em relação ao método KNN tradicional. No entanto, os problemas de rendimento e latência continuam a desafiar os utilizadores que precisam de lidar com cenários de recuperação de dados vectoriais à escala de milhares de milhões.</p>
<p>No Milvus 2.1, há um novo protocolo de roteamento que não depende mais de filas de mensagens no link de recuperação, reduzindo significativamente a latência de recuperação para pequenos conjuntos de dados. Os resultados dos nossos testes mostram que o Milvus reduz agora o seu nível de latência para 5 ms, o que satisfaz os requisitos de ligações em linha críticas, como a pesquisa de semelhanças e a recomendação.</p>
<h2 id="Concurrency-control" class="common-anchor-header">Controlo de simultaneidade<button data-href="#Concurrency-control" class="anchor-icon" translate="no">
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
    </button></h2><p>O Milvus 2.1 aperfeiçoa o seu modelo de concorrência introduzindo um novo modelo de avaliação de custos e um programador de concorrência. Agora fornece controlo de concorrência, o que garante que não haverá um grande número de pedidos simultâneos a competir pelos recursos da CPU e da cache, nem a CPU será subutilizada por não haver pedidos suficientes. A nova camada de agendamento inteligente do Milvus 2.1 também mescla consultas small-nq que têm parâmetros de solicitação consistentes, proporcionando um incrível aumento de desempenho de 3,2x em cenários com small-nq e alta simultaneidade de consultas.</p>
<h2 id="In-memory-replicas" class="common-anchor-header">Réplicas na memória<button data-href="#In-memory-replicas" class="anchor-icon" translate="no">
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
    </button></h2><p>O Milvus 2.1 traz réplicas na memória que melhoram a escalabilidade e a disponibilidade para pequenos conjuntos de dados. À semelhança das réplicas só de leitura nas bases de dados tradicionais, as réplicas na memória podem ser escaladas horizontalmente adicionando máquinas quando o QPS de leitura é elevado. Na recuperação de vectores para pequenos conjuntos de dados, um sistema de recomendação necessita frequentemente de fornecer um QPS que excede o limite de desempenho de uma única máquina. Nestes cenários, o rendimento do sistema pode ser significativamente melhorado carregando várias réplicas na memória. No futuro, introduziremos também um mecanismo de leitura com cobertura baseado em réplicas na memória, que solicitará rapidamente outras cópias funcionais no caso de o sistema precisar de recuperar de falhas e utiliza plenamente a redundância da memória para melhorar a disponibilidade geral do sistema.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/What_s_New_in_Milvus_2_1_Figure_1_excalidraw_1f7fe3c998.png" alt="In-memory replicas allow query services to be based on separate
copies of the same data." class="doc-image" id="in-memory-replicas-allow-query-services-to-be-based-on-separate-copies-of-the-same-data." />
   </span> <span class="img-wrapper"> <span>As réplicas na memória permitem que os serviços de consulta se baseiem em cópias separadas dos mesmos dados</span>. </span></p>
<h2 id="Faster-data-loading" class="common-anchor-header">Carregamento de dados mais rápido<button data-href="#Faster-data-loading" class="anchor-icon" translate="no">
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
    </button></h2><p>O último aumento de desempenho vem do carregamento de dados. O Milvus 2.1 agora comprime <a href="https://milvus.io/docs/v2.1.x/glossary.md#Log-snapshot">logs binários</a> com o Zstandard (zstd), o que reduz significativamente o tamanho dos dados nos armazenamentos de objetos e mensagens, bem como a sobrecarga da rede durante o carregamento de dados. Além disso, agora são introduzidos pools de goroutine para que o Milvus possa carregar segmentos simultaneamente com pegadas de memória controladas e minimizar o tempo necessário para se recuperar de falhas e para carregar dados.</p>
<p>Os resultados completos do benchmark Milvus 2.1 serão divulgados em breve no nosso sítio Web. Fique atento.</p>
<h2 id="String-and-scalar-index-support" class="common-anchor-header">Suporte a índices de strings e escalares<button data-href="#String-and-scalar-index-support" class="anchor-icon" translate="no">
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
    </button></h2><p>Com a versão 2.1, o Milvus agora suporta string de comprimento variável (VARCHAR) como um tipo de dados escalar. VARCHAR pode ser usado como a chave primária que pode ser retornada como saída, e também pode agir como filtros de atributos. <a href="https://milvus.io/docs/v2.1.x/hybridsearch.md">A filtragem de atributos</a> é uma das funções mais populares de que os utilizadores do Milvus necessitam. Se muitas vezes quer &quot;encontrar produtos mais semelhantes a um utilizador numa gama de preços <span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mn>de</mn><mo>200-200</mo></mrow><annotation encoding="application/x-tex">-</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.7278em;vertical-align:-0.0833em;"></span><span class="mord">200-300</span></span></span></span>&quot;, ou &quot;encontrar artigos que têm a palavra-chave 'base de dados vetorial' e estão relacionados com tópicos nativos da nuvem&quot;, vai adorar o Milvus 2.1.</p>
<p>O Milvus 2.1 também suporta índice invertido escalar para melhorar a velocidade de filtragem com base em<a href="https://github.com/s-yata/marisa-trie">MARISA-Tries</a><a href="https://www.cs.le.ac.uk/people/ond1/XMLcomp/confersWEA06_LOUDS.pdf">sucintas</a>como estrutura de dados. Agora, todos os dados podem ser carregados na memória com uma pegada muito baixa, o que permite uma comparação muito mais rápida, filtragem e correspondência de prefixos em strings. Os resultados dos nossos testes mostram que o requisito de memória do MARISA-trie é apenas 10% do dos dicionários Python para carregar todos os dados na memória e fornecer capacidades de consulta.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/What_s_new_in_Milvus_Figure_2_excalidraw_a1149aca96.png" alt="Milvus 2.1 combines MARISA-Trie with inverted index to significantly improve filtering speed." class="doc-image" id="milvus-2.1-combines-marisa-trie-with-inverted-index-to-significantly-improve-filtering-speed." />
   </span> <span class="img-wrapper"> <span>O Milvus 2.1 combina o MARISA-Trie com o índice invertido para melhorar significativamente a velocidade de filtragem.</span> </span></p>
<p>No futuro, o Milvus continuará a concentrar-se em desenvolvimentos relacionados com a consulta escalar, suportará mais tipos de índices escalares e operadores de consulta, e fornecerá capacidades de consulta escalar baseadas em disco, tudo como parte de um esforço contínuo para reduzir o custo de armazenamento e utilização de dados escalares.</p>
<custom-h1>Melhorias de usabilidade</custom-h1><h2 id="Kafka-support" class="common-anchor-header">Suporte ao Kafka<button data-href="#Kafka-support" class="anchor-icon" translate="no">
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
    </button></h2><p>O Milvus 2.1 oferece-lhe agora a opção de utilizar<a href="https://pulsar.apache.org">o Pulsar</a> ou o Kafka como armazenamento de <a href="https://milvus.io/docs/v2.1.x/deploy_pulsar.md">mensagens</a> com base nas configurações do utilizador, graças ao design de abstração e encapsulamento do Milvus e ao SDK Go <a href="https://kafka.apache.org">Kafka</a> contribuído pela Confluent.</p>
<h2 id="Production-ready-Java-SDK" class="common-anchor-header">SDK Java pronto para produção<button data-href="#Production-ready-Java-SDK" class="anchor-icon" translate="no">
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
    </button></h2><p>Com o Milvus 2.1, o nosso <a href="https://github.com/milvus-io/milvus-sdk-java">Java SDK</a> é agora oficialmente lançado. O Java SDK tem exatamente as mesmas capacidades que o Python SDK, com um desempenho de concorrência ainda melhor. No próximo passo, os colaboradores da nossa comunidade irão gradualmente melhorar a documentação e os casos de uso para o Java SDK, e ajudar a empurrar os SDKs Go e RESTful para a fase de produção também.</p>
<h2 id="Observability-and-maintainability" class="common-anchor-header">Observabilidade e facilidade de manutenção<button data-href="#Observability-and-maintainability" class="anchor-icon" translate="no">
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
    </button></h2><p>O Milvus 2.1 adiciona<a href="https://milvus.io/docs/v2.1.x/metrics_dashboard.md">métricas</a> de monitorização importantes, como contagens de inserção de vectores, latência/rendimento da pesquisa, sobrecarga de memória do nó e sobrecarga da CPU. Além disso, a nova versão também optimiza significativamente a manutenção de registos, ajustando os níveis de registo e reduzindo a impressão de registos inúteis.</p>
<h2 id="Embedded-Milvus" class="common-anchor-header">Milvus incorporado<button data-href="#Embedded-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>O Milvus simplificou bastante a implementação de serviços de recuperação de dados vectoriais maciços em grande escala, mas para os cientistas que pretendem validar algoritmos numa escala mais pequena, o Docker ou o K8s continuam a ser demasiado complicados e desnecessários. Com a introdução do Milvus <a href="https://github.com/milvus-io/embd-milvus">embutido</a>, agora é possível instalar o Milvus usando pip, assim como com Pyrocksb e Pysqlite. O Milvus embutido suporta todas as funcionalidades das versões cluster e standalone, permitindo-lhe mudar facilmente do seu laptop para um ambiente de produção distribuído sem alterar uma única linha de código. Os engenheiros de algoritmos terão uma experiência muito melhor ao construir um protótipo com o Milvus.</p>
<custom-h1>Experimente agora a pesquisa vetorial pronta a utilizar</custom-h1><p>Além disso, o Milvus 2.1 também apresenta algumas grandes melhorias em termos de estabilidade e escalabilidade, e aguardamos com expetativa a sua utilização e os seus comentários.</p>
<h2 id="Whats-next" class="common-anchor-header">O que vem a seguir<button data-href="#Whats-next" class="anchor-icon" translate="no">
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
<li>Veja as <a href="https://milvus.io/docs/v2.1.x/release_notes.md">Notas de Lançamento</a> detalhadas para todas as mudanças no Milvus 2.1</li>
<li><a href="https://milvus.io/docs/v2.1.x/install_standalone-docker.md">Instale</a>o Milvus 2.1 e experimente as novas funcionalidades</li>
<li>Junte-se à nossa <a href="https://slack.milvus.io/">comunidade Slack</a> e discuta as novas funcionalidades com milhares de utilizadores do Milvus em todo o mundo</li>
<li>Siga-nos no <a href="https://twitter.com/milvusio">Twitter</a> e no<a href="https://www.linkedin.com/company/the-milvus-project">LinkedIn</a> para receber actualizações assim que os nossos blogues sobre novas funcionalidades específicas forem publicados</li>
</ul>
<blockquote>
<p>Editado por <a href="https://github.com/songxianj">Songxian Jiang</a></p>
</blockquote>
