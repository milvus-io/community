---
id: Milvus-2-2-8-better-query-performance-20-higher-throughputs.md
title: 'Milvus 2.2.8: Melhor desempenho de consulta, taxa de transferência 20% maior'
author: Fendy Feng
date: 2023-05-12T00:00:00.000Z
cover: assets.zilliz.com/What_s_New_in_2_2_8_f4dd6de0f2.png
tag: News
tags: >-
  Milvus, Vector Database, Open Source, Data science, Artificial Intelligence,
  Vector Management
recommend: true
canonicalUrl: >-
  https://milvus.io/blog/Milvus-2-2-8-better-query-performance-20-higher-throughputs.md
---
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/What_s_New_in_2_2_8_f4dd6de0f2.png" alt="Milvus 2.2.8" class="doc-image" id="milvus-2.2.8" />
   </span> <span class="img-wrapper"> <span>Milvus 2.2.8</span> </span></p>
<p>Temos o prazer de anunciar o nosso mais recente lançamento do Milvus 2.2.8. Esta versão inclui inúmeras melhorias e correcções de erros das versões anteriores, resultando num melhor desempenho de consulta, poupança de recursos e maior produtividade. Vamos dar uma olhada no que há de novo nesta versão juntos.</p>
<h2 id="Reduced-peak-memory-consumption-during-collection-loading" class="common-anchor-header">Redução do pico de consumo de memória durante o carregamento da coleção<button data-href="#Reduced-peak-memory-consumption-during-collection-loading" class="anchor-icon" translate="no">
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
    </button></h2><p>Para realizar consultas, o Milvus precisa de carregar dados e índices para a memória. No entanto, durante o processo de carregamento, várias cópias de memória podem fazer com que o pico de utilização de memória aumente até três a quatro vezes mais do que durante o tempo de execução real. A última versão do Milvus 2.2.8 resolve eficazmente este problema e optimiza a utilização da memória.</p>
<h2 id="Expanded-querying-scenarios-with-QueryNode-supporting-plugins" class="common-anchor-header">Cenários de consulta alargados com plug-ins de suporte do QueryNode<button data-href="#Expanded-querying-scenarios-with-QueryNode-supporting-plugins" class="anchor-icon" translate="no">
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
    </button></h2><p>O QueryNode agora suporta plugins na última versão do Milvus 2.2.8. Pode facilmente especificar o caminho do ficheiro do plugin com a configuração <code translate="no">queryNode.soPath</code>. Depois, o Milvus pode carregar o plugin em tempo de execução e expandir os cenários de consulta disponíveis. Consulte a <a href="https://pkg.go.dev/plugin">documentação do plugin Go</a>, se precisar de orientação sobre o desenvolvimento de plugins.</p>
<h2 id="Optimized-querying-performance-with-enhanced-compaction-algorithm" class="common-anchor-header">Desempenho de consulta optimizado com algoritmo de compactação melhorado<button data-href="#Optimized-querying-performance-with-enhanced-compaction-algorithm" class="anchor-icon" translate="no">
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
    </button></h2><p>O algoritmo de compactação determina a velocidade com que os segmentos podem convergir, afetando diretamente o desempenho da consulta. Com as recentes melhorias no algoritmo de compactação, a eficiência da convergência melhorou drasticamente, resultando em consultas mais rápidas.</p>
<h2 id="Better-resource-saving-and-querying-performance-with-reduced-collection-shards" class="common-anchor-header">Melhor economia de recursos e desempenho de consulta com fragmentos de coleção reduzidos<button data-href="#Better-resource-saving-and-querying-performance-with-reduced-collection-shards" class="anchor-icon" translate="no">
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
    </button></h2><p>O Milvus é um sistema de processamento paralelo massivo (MPP), o que significa que o número de fragmentos de coleção tem impacto na eficiência do Milvus na escrita e na consulta. Nas versões anteriores, uma coleção tinha dois fragmentos por defeito, o que resultava num excelente desempenho de escrita mas comprometia o desempenho de consulta e o custo dos recursos. Com a nova atualização do Milvus 2.2.8, os fragmentos de coleção predefinidos foram reduzidos para um, permitindo aos utilizadores poupar mais recursos e efetuar melhores consultas. A maioria dos utilizadores da comunidade tem menos de 10 milhões de volumes de dados, e um fragmento é suficiente para obter um bom desempenho de escrita.</p>
<p><strong>Nota</strong>: Esta atualização não afecta as colecções criadas antes desta versão.</p>
<h2 id="20-throughput-increase-with-an-improved-query-grouping-algorithm" class="common-anchor-header">Aumento de 20% na taxa de transferência com um algoritmo de agrupamento de consultas melhorado<button data-href="#20-throughput-increase-with-an-improved-query-grouping-algorithm" class="anchor-icon" translate="no">
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
    </button></h2><p>O Milvus tem um algoritmo de agrupamento de consultas eficiente que combina vários pedidos de consulta na fila num só para uma execução mais rápida, melhorando significativamente a taxa de transferência. Na última versão, introduzimos melhorias adicionais neste algoritmo, aumentando o rendimento do Milvus em pelo menos 20%.</p>
<p>Para além das melhorias mencionadas, o Milvus 2.2.8 também corrige vários bugs. Para mais detalhes, consulte <a href="https://milvus.io/docs/release_notes.md">as Notas de Lançamento do Milvus</a>.</p>
<h2 id="Let’s-keep-in-touch" class="common-anchor-header">Vamos manter-nos em contacto!<button data-href="#Let’s-keep-in-touch" class="anchor-icon" translate="no">
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
    </button></h2><p>Se tiver dúvidas ou comentários sobre o Milvus, não hesite em contactar-nos através do <a href="https://twitter.com/milvusio">Twitter</a> ou do <a href="https://www.linkedin.com/company/the-milvus-project">LinkedIn</a>. Também pode juntar-se ao nosso <a href="https://milvus.io/slack/">canal Slack</a> para conversar diretamente com os nossos engenheiros e com toda a comunidade ou visitar o nosso <a href="https://us02web.zoom.us/meeting/register/tZ0pcO6vrzsuEtVAuGTpNdb6lGnsPBzGfQ1T#/registration">horário de expediente às terças-feiras</a>!</p>
