---
id: select-index-parameters-ivf-index.md
title: 1. index_file_size
author: milvus
date: 2020-02-26T22:57:02.071Z
desc: Melhores práticas para o índice de FIV
cover: assets.zilliz.com/header_4d3fc44879.jpg
tag: Engineering
canonicalUrl: 'https://zilliz.com/blog/select-index-parameters-ivf-index'
---
<custom-h1>Como selecionar parâmetros de índice para o índice IVF</custom-h1><p>Em <a href="https://medium.com/@milvusio/best-practices-for-milvus-configuration-f38f1e922418">Best Practices for Milvus Configuration</a>, foram introduzidas algumas das melhores práticas para a configuração do Milvus 0.6.0. Neste artigo, também apresentaremos algumas práticas recomendadas para definir parâmetros-chave nos clientes Milvus para operações que incluem a criação de uma tabela, a criação de índices e a pesquisa. Estes parâmetros podem afetar o desempenho da pesquisa.</p>
<h2 id="1-codeindexfilesizecode" class="common-anchor-header">1. <code translate="no">index_file_size</code><button data-href="#1-codeindexfilesizecode" class="anchor-icon" translate="no">
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
    </button></h2><p>Ao criar uma tabela, o parâmetro index_file_size é utilizado para especificar o tamanho, em MB, de um único ficheiro para armazenamento de dados. A predefinição é 1024. Quando os dados vectoriais estão a ser importados, o Milvus combina os dados em ficheiros de forma incremental. Quando o tamanho do ficheiro atinge o tamanho_do_ficheiro_de_índice, este ficheiro não aceita novos dados e o Milvus guarda os novos dados noutro ficheiro. Estes são todos ficheiros de dados em bruto. Quando um índice é criado, o Milvus gera um ficheiro de índice para cada ficheiro de dados brutos. Para o tipo de índice IVFLAT, o tamanho do ficheiro de índice é aproximadamente igual ao tamanho do ficheiro de dados brutos correspondente. Para o índice SQ8, o tamanho de um ficheiro de índice é aproximadamente 30 por cento do ficheiro de dados em bruto correspondente.</p>
<p>Durante uma pesquisa, o Milvus pesquisa cada ficheiro de índice um a um. De acordo com a nossa experiência, quando index_file_size muda de 1024 para 2048, o desempenho da pesquisa melhora em 30 a 50 por cento. No entanto, se o valor for muito grande, os arquivos grandes podem não ser carregados na memória da GPU (ou mesmo na memória da CPU). Por exemplo, se a memória da GPU for de 2 GB e index_file_size for de 3 GB, o arquivo de índice não poderá ser carregado na memória da GPU. Normalmente, definimos index_file_size para 1024 MB ou 2048 MB.</p>
<p>A tabela a seguir mostra um teste usando sift50m para index_file_size. O tipo de índice é SQ8.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1_sift50m_test_results_milvus_74f60de4aa.png" alt="1-sift50m-test-results-milvus.png" class="doc-image" id="1-sift50m-test-results-milvus.png" />
   </span> <span class="img-wrapper"> <span>1-sift50m-test-results-milvus.png</span> </span></p>
<p>Podemos ver que no modo CPU e no modo GPU, quando index_file_size é 2048 MB em vez de 1024 MB, o desempenho da pesquisa melhora significativamente.</p>
<h2 id="2-codenlistcode-and-codenprobecode" class="common-anchor-header">2. <code translate="no">nlist</code> <strong>e</strong> <code translate="no">nprobe</code><button data-href="#2-codenlistcode-and-codenprobecode" class="anchor-icon" translate="no">
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
    </button></h2><p>O parâmetro <code translate="no">nlist</code> é utilizado para a criação do índice e o parâmetro <code translate="no">nprobe</code> é utilizado para a pesquisa. O IVFLAT e o SQ8 utilizam algoritmos de agrupamento para dividir um grande número de vectores em agrupamentos, ou "buckets". <code translate="no">nlist</code> é o número de "buckets" durante o agrupamento.</p>
<p>Quando a pesquisa utiliza índices, o primeiro passo é encontrar um determinado número de compartimentos mais próximos do vetor alvo e o segundo passo é encontrar os k vectores mais semelhantes dos compartimentos através da distância vetorial. <code translate="no">nprobe</code> é o número de compartimentos no primeiro passo.</p>
<p>De um modo geral, o aumento de <code translate="no">nlist</code> leva a um maior número de compartimentos e a um menor número de vectores num compartimento durante o agrupamento. Como resultado, a carga de cálculo diminui e o desempenho da pesquisa melhora. No entanto, com menos vectores para comparação de semelhanças, o resultado correto pode ser perdido.</p>
<p>O aumento de <code translate="no">nprobe</code> leva a um maior número de compartimentos para pesquisa. Como resultado, a carga de cálculo aumenta e o desempenho da pesquisa deteriora-se, mas a precisão da pesquisa melhora. A situação pode variar consoante os conjuntos de dados com diferentes distribuições. Também deve considerar o tamanho do conjunto de dados ao definir <code translate="no">nlist</code> e <code translate="no">nprobe</code>. Geralmente, recomenda-se que <code translate="no">nlist</code> possa ser <code translate="no">4 * sqrt(n)</code>, em que n é o número total de vectores. Quanto a <code translate="no">nprobe</code>, é necessário fazer um compromisso entre precisão e eficiência e a melhor forma de determinar o valor é por tentativa e erro.</p>
<p>A tabela seguinte mostra um teste utilizando sift50m para <code translate="no">nlist</code> e <code translate="no">nprobe</code>. O tipo de índice é SQ8.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/sq8_index_test_sift50m_b5daa9f7b5.png" alt="sq8-index-test-sift50m.png" class="doc-image" id="sq8-index-test-sift50m.png" />
   </span> <span class="img-wrapper"> <span>sq8-index-test-sift50m.png</span> </span></p>
<p>A tabela compara o desempenho e a precisão da pesquisa usando valores diferentes de <code translate="no">nlist</code>/<code translate="no">nprobe</code>. Somente os resultados da GPU são exibidos porque os testes de CPU e GPU têm resultados semelhantes. Neste teste, à medida que os valores de <code translate="no">nlist</code>/<code translate="no">nprobe</code> aumentam na mesma porcentagem, a precisão da pesquisa também aumenta. Quando <code translate="no">nlist</code> = 4096 e <code translate="no">nprobe</code> é 128, o Milvus tem o melhor desempenho de pesquisa. Concluindo, ao determinar os valores para <code translate="no">nlist</code> e <code translate="no">nprobe</code>, é necessário fazer uma troca entre desempenho e precisão, levando em consideração diferentes conjuntos de dados e requisitos.</p>
<h2 id="Summary" class="common-anchor-header">Resumo<button data-href="#Summary" class="anchor-icon" translate="no">
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
    </button></h2><p><code translate="no">index_file_size</code>: Quando o tamanho dos dados é superior a <code translate="no">index_file_size</code>, quanto maior for o valor de <code translate="no">index_file_size</code>, melhor será o desempenho da pesquisa.<code translate="no">nlist</code> e <code translate="no">nprobe</code>：Deve fazer um compromisso entre desempenho e precisão.</p>
