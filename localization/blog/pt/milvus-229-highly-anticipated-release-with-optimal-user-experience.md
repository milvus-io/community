---
id: milvus-229-highly-anticipated-release-with-optimal-user-experience.md
title: >-
  Milvus 2.2.9: Um lançamento muito aguardado com uma óptima experiência de
  utilizador
author: 'Owen Jiao, Fendy Feng'
date: 2023-06-06T00:00:00.000Z
cover: assets.zilliz.com/What_s_New_in_2_2_9_858e54a2d3.png
tag: News
tags: >-
  Milvus, Vector Database, Open Source, Data science, Artificial Intelligence,
  Vector Management
recommend: true
canonicalUrl: >-
  https://milvus.io/blog/milvus-229-highly-anticipated-release-with-optimal-user-experience.md
---
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/What_s_New_in_2_2_9_858e54a2d3.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>É com grande entusiasmo que anunciamos a chegada do Milvus 2.2.9, uma versão muito aguardada que representa um marco significativo para a equipa e para a comunidade. Esta versão oferece muitos recursos interessantes, incluindo o suporte há muito aguardado para tipos de dados JSON, esquema dinâmico e chaves de partição, garantindo uma experiência de utilizador optimizada e um fluxo de trabalho de desenvolvimento simplificado. Além disso, esta versão incorpora inúmeras melhorias e correcções de erros. Junte-se a nós para explorar o Milvus 2.2.9 e descobrir por que essa versão é tão empolgante.</p>
<h2 id="Optimized-user-experience-with-JSON-support" class="common-anchor-header">Experiência de utilizador optimizada com suporte JSON<button data-href="#Optimized-user-experience-with-JSON-support" class="anchor-icon" translate="no">
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
    </button></h2><p>O Milvus introduziu um suporte muito aguardado para o tipo de dados JSON, permitindo o armazenamento contínuo de dados JSON juntamente com os metadados de vectores nas colecções dos utilizadores. Com esta melhoria, os utilizadores podem inserir eficazmente dados JSON em massa e efetuar consultas e filtragens avançadas com base no conteúdo dos seus campos JSON. Além disso, os utilizadores podem utilizar expressões e executar operações adaptadas aos campos JSON do seu conjunto de dados, construir consultas e aplicar filtros com base no conteúdo e na estrutura dos seus campos JSON, permitindo-lhes extrair informações relevantes e manipular melhor os dados.</p>
<p>No futuro, a equipa do Milvus adicionará índices para campos dentro do tipo JSON, optimizando ainda mais o desempenho de consultas escalares e vectoriais mistas. Portanto, fique atento aos desenvolvimentos empolgantes que estão por vir!</p>
<h2 id="Added-flexibility-with-support-for-dynamic-schema" class="common-anchor-header">Maior flexibilidade com suporte para esquemas dinâmicos<button data-href="#Added-flexibility-with-support-for-dynamic-schema" class="anchor-icon" translate="no">
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
    </button></h2><p>Com suporte para dados JSON, o Milvus 2.2.9 agora oferece funcionalidade de esquema dinâmico através de um kit de desenvolvimento de software (SDK) simplificado.</p>
<p>A partir do Milvus 2.2.9, o SDK do Milvus inclui uma API de alto nível que preenche automaticamente os campos dinâmicos no campo JSON oculto da coleção, permitindo que os utilizadores se concentrem apenas nos seus campos de negócio.</p>
<h2 id="Better-data-separation-and-enhanced-search-efficiency-with-Partition-Key" class="common-anchor-header">Melhor separação de dados e maior eficiência de pesquisa com a Chave de Partição<button data-href="#Better-data-separation-and-enhanced-search-efficiency-with-Partition-Key" class="anchor-icon" translate="no">
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
    </button></h2><p>O Milvus 2.2.9 melhora as suas capacidades de particionamento introduzindo a funcionalidade Partition Key. Permite colunas específicas do utilizador como chaves primárias para particionamento, eliminando a necessidade de APIs adicionais como <code translate="no">loadPartition</code> e <code translate="no">releasePartition</code>. Esse novo recurso também remove o limite do número de partições, levando a uma utilização mais eficiente dos recursos.</p>
<h2 id="Support-for-Alibaba-Cloud-OSS" class="common-anchor-header">Suporte para Alibaba Cloud OSS<button data-href="#Support-for-Alibaba-Cloud-OSS" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 2.2.9 agora suporta Alibaba Cloud Object Storage Service (OSS). Os utilizadores de Alibaba Cloud podem configurar facilmente o <code translate="no">cloudProvider</code> para Alibaba Cloud e tirar partido de uma integração perfeita para um armazenamento e recuperação eficientes de dados vectoriais na nuvem.</p>
<p>Para além das funcionalidades mencionadas anteriormente, o Milvus 2.2.9 oferece suporte de base de dados no Controlo de Acesso Baseado em Funções (RBAC), introduz a gestão de ligações e inclui várias melhorias e correcções de erros. Para mais informações, consulte <a href="https://milvus.io/docs/release_notes.md">as notas de lançamento do Milvus 2.2.9</a>.</p>
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
    </button></h2><p>Se tiver dúvidas ou comentários sobre o Milvus, não hesite em contactar-nos através do <a href="https://twitter.com/milvusio">Twitter</a> ou do <a href="https://www.linkedin.com/company/the-milvus-project">LinkedIn</a>. Também é bem-vindo a juntar-se ao nosso <a href="https://milvus.io/slack/">canal Slack</a> para conversar diretamente com os nossos engenheiros e com a comunidade, ou consulte o nosso <a href="https://us02web.zoom.us/meeting/register/tZ0pcO6vrzsuEtVAuGTpNdb6lGnsPBzGfQ1T#/registration">horário de expediente às terças-feiras</a>!</p>
