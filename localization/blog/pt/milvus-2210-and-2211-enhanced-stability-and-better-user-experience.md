---
id: milvus-2210-and-2211-enhanced-stability-and-better-user-experience.md
title: >-
  Milvus 2.2.10 &amp; 2.2.11: Pequenas actualizações para melhorar a
  estabilidade do sistema e a experiência do utilizador
author: 'Fendy Feng, Owen Jiao'
date: 2023-07-06T00:00:00.000Z
cover: assets.zilliz.com/What_s_New_in_Milvus_2_2_10_and_2_2_11_5018946465.png
tag: News
tags: >-
  Milvus, Vector Database, Open Source, Data science, Artificial Intelligence,
  Vector Management
desc: introdução de novas funcionalidades e melhorias do Milvus 2.2.10 e 2.2.11
recommend: true
metaTitle: Milvus 2.2.10 & 2.2.11 Enhanced System Stability and User Experience
canonicalUrl: >-
  https://milvus.io/blog/milvus-2210-and-2211-enhanced-stability-and-better-user-experience.md
---
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/What_s_New_in_Milvus_2_2_10_and_2_2_11_5018946465.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Saudações, fãs do Milvus! Temos o prazer de anunciar que acabámos de lançar o Milvus 2.2.10 e 2.2.11, duas pequenas actualizações que se concentram principalmente na correção de erros e na melhoria geral do desempenho. Pode esperar um sistema mais estável e uma melhor experiência de utilização com estas duas actualizações. Vamos dar uma olhada rápida no que há de novo nessas duas versões.</p>
<h2 id="Milvus-2210" class="common-anchor-header">Milvus 2.2.10<button data-href="#Milvus-2210" class="anchor-icon" translate="no">
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
    </button></h2><p>O Milvus 2.2.10 corrigiu falhas ocasionais do sistema, acelerou o carregamento e a indexação, reduziu a utilização de memória nos nós de dados e efectuou muitas outras melhorias. Abaixo estão algumas mudanças notáveis:</p>
<ul>
<li>Substituído o antigo escritor de carga útil CGO por um novo escrito em Go puro, reduzindo o uso de memória nos nós de dados.</li>
<li>Adicionado <code translate="no">go-api/v2</code> ao ficheiro <code translate="no">milvus-proto</code> para evitar confusão com diferentes versões de <code translate="no">milvus-proto</code>.</li>
<li>Atualizado o Gin da versão 1.9.0 para a 1.9.1 para corrigir um erro na função <code translate="no">Context.FileAttachment</code>.</li>
<li>Adicionado controlo de acesso baseado em funções (RBAC) para as APIs FlushAll e Database.</li>
<li>Corrigida uma falha aleatória causada pelo AWS S3 SDK.</li>
<li>Melhoria das velocidades de carregamento e indexação.</li>
</ul>
<p>Para obter mais detalhes, consulte <a href="https://milvus.io/docs/release_notes.md#2210">as Notas de versão do Milvus 2.2.10</a>.</p>
<h2 id="Milvus-2211" class="common-anchor-header">Milvus 2.2.11<button data-href="#Milvus-2211" class="anchor-icon" translate="no">
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
    </button></h2><p>O Milvus 2.2.11 resolveu vários problemas para melhorar a estabilidade do sistema. Também melhorou o seu desempenho na monitorização, registo, limitação da taxa e interceção de pedidos entre clusters. Veja abaixo os destaques desta atualização.</p>
<ul>
<li>Adicionado um intercetor ao servidor Milvus GRPC para evitar quaisquer problemas com o encaminhamento entre clusters.</li>
<li>Adicionados códigos de erro ao gerenciador de pedaços do minio para facilitar o diagnóstico e a correção de erros.</li>
<li>Utilizado um pool de corrotinas singleton para evitar o desperdício de corrotinas e maximizar o uso de recursos.</li>
<li>Reduziu o uso de disco para o RocksMq para um décimo do seu nível original ao ativar a compressão zstd.</li>
<li>Corrigido o pânico ocasional do QueryNode durante o carregamento.</li>
<li>Corrigido o problema de limitação de pedidos de leitura causado pelo erro de cálculo do comprimento da fila duas vezes.</li>
<li>Corrigidos problemas com GetObject retornando valores nulos no MacOS.</li>
<li>Corrigida uma falha causada pelo uso incorreto do modificador noexcept.</li>
</ul>
<p>Para obter mais detalhes, consulte <a href="https://milvus.io/docs/release_notes.md#2211">as Notas de versão do Milvus 2.2.11</a>.</p>
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
    </button></h2><p>Se tiver perguntas ou comentários sobre o Milvus, não hesite em contactar-nos através do <a href="https://twitter.com/milvusio">Twitter</a> ou do <a href="https://www.linkedin.com/company/the-milvus-project">LinkedIn</a>. Também é bem-vindo a juntar-se ao nosso <a href="https://milvus.io/slack/">canal Slack</a> para conversar diretamente com os nossos engenheiros e com a comunidade, ou consulte o nosso <a href="https://us02web.zoom.us/meeting/register/tZ0pcO6vrzsuEtVAuGTpNdb6lGnsPBzGfQ1T#/registration">horário de expediente às terças-feiras</a>!</p>
