---
id: >-
  milvus-2-3-4-faster-searches-expanded-data-support-improved-monitoring-and-more.md
title: >-
  Milvus 2.3.4: Pesquisas mais rápidas, suporte de dados alargado, monitorização
  melhorada e muito mais
author: 'Ken Zhang, Fendy Feng'
date: 2024-01-12T00:00:00.000Z
cover: assets.zilliz.com/What_is_new_in_Milvus_2_3_4_1847b0fa8a.png
tag: News
tags: >-
  Milvus, Vector Database, Open Source, Data science, Artificial Intelligence,
  Vector Management, Vector Search
desc: Apresentação das novas funcionalidades e melhorias do Milvus 2.3.4
recommend: true
canonicalUrl: >-
  https://milvus.io/blog/milvus-2-3-4-faster-searches-expanded-data-support-improved-monitoring-and-more.md
---
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/What_is_new_in_Milvus_2_3_4_1847b0fa8a.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Temos o prazer de apresentar a última versão do Milvus 2.3.4. Esta atualização introduz um conjunto de funcionalidades e melhorias meticulosamente concebidas para otimizar o desempenho, aumentar a eficiência e proporcionar uma experiência de utilizador perfeita. Nesta postagem do blog, vamos nos aprofundar nos destaques do Milvus 2.3.4.</p>
<h2 id="Access-logs-for-improved-monitoring" class="common-anchor-header">Registos de acesso para uma melhor monitorização<button data-href="#Access-logs-for-improved-monitoring" class="anchor-icon" translate="no">
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
    </button></h2><p>O Milvus agora suporta logs de acesso, oferecendo informações valiosas sobre interações com interfaces externas. Estes registos gravam os nomes dos métodos, os pedidos dos utilizadores, os tempos de resposta, os códigos de erro e outras informações de interação, permitindo aos programadores e administradores de sistemas efetuar análises de desempenho, auditorias de segurança e uma resolução de problemas eficiente.</p>
<p><strong><em>Nota:</em></strong> <em>Atualmente, os registos de acesso apenas suportam interações gRPC. No entanto, o nosso compromisso de melhoria continua e as versões futuras irão alargar esta capacidade para incluir registos de pedidos RESTful.</em></p>
<p>Para obter informações mais detalhadas, consulte <a href="https://milvus.io/docs/configure_access_logs.md">Configurar logs de acesso</a>.</p>
<h2 id="Parquet-file-imports-for-enhanced-data-processing-efficiency" class="common-anchor-header">Importação de ficheiros Parquet para uma maior eficiência no processamento de dados<button data-href="#Parquet-file-imports-for-enhanced-data-processing-efficiency" class="anchor-icon" translate="no">
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
    </button></h2><p>O Milvus 2.3.4 agora suporta a importação de arquivos Parquet, um formato de armazenamento colunar amplamente adotado, projetado para aumentar a eficiência do armazenamento e processamento de conjuntos de dados em grande escala. Esta adição oferece aos utilizadores uma maior flexibilidade e eficiência nos seus esforços de processamento de dados. Ao eliminar a necessidade de conversões laboriosas de formatos de dados, os utilizadores que gerem conjuntos de dados substanciais no formato Parquet terão um processo de importação de dados simplificado, reduzindo significativamente o tempo desde a preparação inicial dos dados até à subsequente recuperação de vectores.</p>
<p>Além disso, a nossa ferramenta de conversão de formatos de dados, BulkWriter, adoptou agora o Parquet como formato de dados de saída predefinido, garantindo uma experiência mais intuitiva para os programadores.</p>
<h2 id="Binlog-index-on-growing-segments-for-faster-searches" class="common-anchor-header">Índice binlog em segmentos crescentes para pesquisas mais rápidas<button data-href="#Binlog-index-on-growing-segments-for-faster-searches" class="anchor-icon" translate="no">
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
    </button></h2><p>O Milvus utiliza agora um índice binlog em segmentos crescentes, resultando em pesquisas até dez vezes mais rápidas em segmentos crescentes. Esta melhoria aumenta significativamente a eficiência da pesquisa e suporta índices avançados como o IVF ou o Fast Scan, melhorando a experiência geral do utilizador.</p>
<h2 id="Support-for-up-to-10000-collectionspartitions" class="common-anchor-header">Suporte para até 10.000 colecções/partições<button data-href="#Support-for-up-to-10000-collectionspartitions" class="anchor-icon" translate="no">
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
    </button></h2><p>Tal como as tabelas e as partições nas bases de dados relacionais, as colecções e as partições são as unidades principais para armazenar e gerir dados vectoriais no Milvus. Em resposta à evolução das necessidades dos utilizadores em termos de organização de dados, o Milvus 2.3.4 suporta agora até 10 000 colecções/partições num cluster, um salto significativo em relação ao limite anterior de 4 096. Esta melhoria beneficia diversos casos de utilização, como a gestão de bases de dados de conhecimento e ambientes multi-tenant. O suporte expandido para colecções/partições resulta de refinamentos no mecanismo de marcação de tempo, gestão de goroutine e utilização de memória.</p>
<p><strong><em>Observação:</em></strong> <em>o limite recomendado para o número de coleções/partições é 10.000, pois exceder esse limite pode afetar a recuperação de falhas e o uso de recursos.</em></p>
<h2 id="Other-enhancements" class="common-anchor-header">Outras melhorias<button data-href="#Other-enhancements" class="anchor-icon" translate="no">
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
    </button></h2><p>Para além das funcionalidades acima referidas, o Milvus 2.3.4 inclui várias melhorias e correcções de erros. Estas incluem a redução do uso de memória durante a recuperação de dados e o tratamento de dados de comprimento variável, mensagens de erro refinadas, velocidade de carregamento acelerada e melhor equilíbrio de fragmentos de consulta. Estas melhorias colectivas contribuem para uma experiência geral do utilizador mais suave e eficiente.</p>
<p>Para uma visão abrangente de todas as alterações introduzidas no Milvus 2.3.4, consulte <a href="https://milvus.io/docs/release_notes.md#v234">as</a> nossas <a href="https://milvus.io/docs/release_notes.md#v234">Notas de Lançamento</a>.</p>
<h2 id="Stay-connected" class="common-anchor-header">Fique ligado!<button data-href="#Stay-connected" class="anchor-icon" translate="no">
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
    </button></h2><p>Se tiver perguntas ou comentários sobre o Milvus, junte-se ao nosso <a href="https://discord.com/invite/8uyFbECzPX">canal Discord</a> para interagir com os nossos engenheiros e a comunidade diretamente ou junte-se ao nosso <a href="https://discord.com/invite/RjNbk8RR4f">Milvus Community Lunch and Learn</a> todas as terças-feiras das 12-12:30 PM PST. Também pode seguir-nos no <a href="https://twitter.com/milvusio">Twitter</a> ou no <a href="https://www.linkedin.com/company/the-milvus-project">LinkedIn</a> para obter as últimas notícias e actualizações sobre o Milvus.</p>
