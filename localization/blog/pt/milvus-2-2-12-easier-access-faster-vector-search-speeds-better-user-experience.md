---
id: >-
  milvus-2-2-12-easier-access-faster-vector-search-speeds-better-user-experience.md
title: >-
  Milvus 2.2.12: Acesso mais fácil, velocidades de pesquisa de vectores mais
  rápidas e melhor experiência do utilizador
author: 'Owen Jiao, Fendy Feng'
date: 2023-07-28T00:00:00.000Z
cover: assets.zilliz.com/What_s_New_in_2_2_12_20230720_143424_7d19280738.png
tag: News
tags: >-
  Milvus, Vector Database, Open Source, Data science, Artificial Intelligence,
  Vector Management, Vector Search
recommend: true
canonicalUrl: >-
  https://milvus.io/blog/milvus-2-2-12-easier-access-faster-vector-search-speeds-better-user-experience.md
---
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/What_s_New_in_2_2_12_20230720_143424_7d19280738.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Temos o prazer de anunciar a última versão do Milvus 2.2.12. Esta atualização inclui várias novas funcionalidades, como o suporte para a API RESTful, a função <code translate="no">json_contains</code> e a recuperação de vectores durante as pesquisas ANN, em resposta ao feedback dos utilizadores. Também simplificámos a experiência do utilizador, melhorámos as velocidades de pesquisa de vectores e resolvemos muitos problemas. Vamos ver o que podemos esperar do Milvus 2.2.12.</p>
<h2 id="Support-for-RESTful-API" class="common-anchor-header">Suporte para API RESTful<button data-href="#Support-for-RESTful-API" class="anchor-icon" translate="no">
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
    </button></h2><p>O Milvus 2.2.12 suporta agora a API RESTful, que permite aos utilizadores aceder ao Milvus sem instalar um cliente, tornando as operações cliente-servidor mais fáceis. Além disso, a implementação do Milvus tornou-se mais conveniente porque o Milvus SDK e a API RESTful partilham o mesmo número de porta.</p>
<p><strong>Nota</strong>: Continuamos a recomendar a utilização do SDK para implementar o Milvus em operações avançadas ou se a sua empresa for sensível à latência.</p>
<h2 id="Vector-retrieval-during-ANN-searches" class="common-anchor-header">Recuperação de vectores durante as pesquisas ANN<button data-href="#Vector-retrieval-during-ANN-searches" class="anchor-icon" translate="no">
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
    </button></h2><p>Nas versões anteriores, o Milvus não permitia a recuperação de vectores durante as pesquisas ANN (approximate nearest neighbor) para dar prioridade ao desempenho e à utilização de memória. Como resultado, a recuperação de vectores brutos tinha de ser dividida em duas etapas: executar a pesquisa ANN e, em seguida, consultar os vectores brutos com base nos seus IDs. Esta abordagem aumentou os custos de desenvolvimento e dificultou a implementação e adoção do Milvus pelos utilizadores.</p>
<p>Com o Milvus 2.2.12, os utilizadores podem obter vectores brutos durante as pesquisas ANN, definindo o campo do vetor como um campo de saída e consultando em colecções indexadas HNSW-, DiskANN-, ou IVF-FLAT. Além disso, os utilizadores podem esperar uma velocidade de recuperação de vectores muito mais rápida.</p>
<h2 id="Support-for-operations-on-JSON-arrays" class="common-anchor-header">Suporte para operações em matrizes JSON<button data-href="#Support-for-operations-on-JSON-arrays" class="anchor-icon" translate="no">
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
    </button></h2><p>Recentemente, adicionámos suporte para JSON no Milvus 2.2.8. Desde então, os utilizadores enviaram inúmeros pedidos para suportar operações adicionais em arrays JSON, tais como inclusão, exclusão, intersecção, união, diferença, e muito mais. No Milvus 2.2.12, priorizamos o suporte à função <code translate="no">json_contains</code> para habilitar a operação de inclusão. Continuaremos a adicionar suporte para outros operadores em versões futuras.</p>
<h2 id="Enhancements-and-bug-fixes" class="common-anchor-header">Melhorias e correcções de erros<button data-href="#Enhancements-and-bug-fixes" class="anchor-icon" translate="no">
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
    </button></h2><p>Para além de introduzir novas funcionalidades, o Milvus 2.2.12 melhorou o desempenho da pesquisa vetorial com uma sobrecarga reduzida, facilitando o tratamento de pesquisas topk extensas. Além disso, melhora o desempenho de escrita em situações de partição-chave e multi-partição e otimiza o uso da CPU para máquinas grandes. Esta atualização aborda vários problemas: uso excessivo do disco, compactação travada, exclusões de dados infrequentes e falhas de inserção em massa. Para mais informações, consulte as <a href="https://milvus.io/docs/release_notes.md#2212">Notas de lançamento do Milvus 2.2.12</a>.</p>
<h2 id="Lets-keep-in-touch" class="common-anchor-header">Vamos manter-nos em contacto!<button data-href="#Lets-keep-in-touch" class="anchor-icon" translate="no">
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
    </button></h2><p>Se tiver perguntas ou comentários sobre o Milvus, não hesite em contactar-nos através do <a href="https://twitter.com/milvusio">Twitter</a> ou do <a href="https://www.linkedin.com/company/the-milvus-project">LinkedIn</a>. Também é bem-vindo a juntar-se ao nosso <a href="https://milvus.io/slack/">canal Slack</a> para conversar diretamente com os nossos engenheiros e com a comunidade, ou consulte o nosso <a href="https://us02web.zoom.us/meeting/register/tZ0pcO6vrzsuEtVAuGTpNdb6lGnsPBzGfQ1T#/registration">horário de expediente às terças-feiras</a>!</p>
