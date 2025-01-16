---
id: revealing-milvus-2-3-2-and-milvus-2-3-3.md
title: >-
  Revelando Milvus 2.3.2 &amp; 2.3.3: Suporte para tipos de dados de matriz,
  exclusão complexa, integração com TiKV e muito mais
author: 'Fendy Feng, Owen Jiao'
date: 2023-11-20T00:00:00.000Z
desc: >-
  Hoje, temos o prazer de anunciar o lançamento do Milvus 2.3.2 e 2.3.3! Estas
  actualizações trazem muitas funcionalidades interessantes, optimizações e
  melhorias, melhorando o desempenho do sistema, a flexibilidade e a experiência
  geral do utilizador.
cover: assets.zilliz.com/What_s_New_in_Milvus_2_3_2_and_2_3_3_d3d0db03c3.png
tag: News
tags: >-
  Milvus, Vector Database, Open Source, Data science, Artificial Intelligence,
  Vector Management, Vector Search
recommend: true
canonicalUrl: null
---
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/What_s_New_in_Milvus_2_3_2_and_2_3_3_d3d0db03c3.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>No panorama em constante evolução das tecnologias de pesquisa vetorial, o Milvus mantém-se na vanguarda, ultrapassando os limites e estabelecendo novos padrões. Hoje, temos o prazer de anunciar o lançamento do Milvus 2.3.2 e 2.3.3! Estas actualizações trazem muitas caraterísticas interessantes, optimizações e melhorias, melhorando o desempenho do sistema, a flexibilidade e a experiência geral do utilizador.</p>
<h2 id="Support-for-Array-data-types---making-search-results-more-accurate-and-relevant" class="common-anchor-header">Suporte para tipos de dados Array - tornando os resultados da pesquisa mais precisos e relevantes<button data-href="#Support-for-Array-data-types---making-search-results-more-accurate-and-relevant" class="anchor-icon" translate="no">
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
    </button></h2><p>A adição do suporte ao tipo de dados Array é uma melhoria fundamental para o Milvus, particularmente em cenários de filtragem de consultas como intersecção e união. Esta adição garante que os resultados da pesquisa são não só mais exactos como também mais relevantes. Em termos práticos, por exemplo, no sector do comércio eletrónico, as etiquetas de produtos armazenadas como arrays de cadeias de caracteres permitem aos consumidores efetuar pesquisas avançadas, filtrando resultados irrelevantes.</p>
<p>Mergulhe na nossa <a href="https://milvus.io/docs/array_data_type.md">documentação</a> abrangente para obter um guia detalhado sobre a utilização de tipos Array em Milvus.</p>
<h2 id="Support-for-complex-delete-expressions---improving-your-data-management" class="common-anchor-header">Suporte para expressões de eliminação complexas - melhorando a sua gestão de dados<button data-href="#Support-for-complex-delete-expressions---improving-your-data-management" class="anchor-icon" translate="no">
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
    </button></h2><p>Nas versões anteriores, o Milvus suportava expressões de eliminação de chaves primárias, proporcionando uma arquitetura estável e simplificada. Com o Milvus 2.3.2 ou 2.3.3, os utilizadores podem empregar expressões de eliminação complexas, facilitando tarefas sofisticadas de gestão de dados, como a limpeza contínua de dados antigos ou a eliminação de dados em conformidade com o RGPD com base em IDs de utilizador.</p>
<p>Nota: Certifique-se de que carregou as colecções antes de utilizar expressões complexas. Além disso, é importante notar que o processo de eliminação não garante a atomicidade.</p>
<h2 id="TiKV-integration---scalable-metadata-storage-with-stability" class="common-anchor-header">Integração do TiKV - armazenamento de metadados escalável com estabilidade<button data-href="#TiKV-integration---scalable-metadata-storage-with-stability" class="anchor-icon" translate="no">
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
    </button></h2><p>Anteriormente dependente do Etcd para o armazenamento de metadados, a Milvus enfrentou desafios de capacidade limitada e de escalabilidade no armazenamento de metadados. Para resolver estes problemas, a Milvus adicionou o TiKV, um armazenamento de valores chave de código aberto, como mais uma opção para o armazenamento de metadados. O TiKV oferece maior escalabilidade, estabilidade e eficiência, tornando-o uma solução ideal para os requisitos em evolução da Milvus. A partir do Milvus 2.3.2, os utilizadores podem fazer a transição para o TiKV para o seu armazenamento de metadados modificando a configuração.</p>
<h2 id="Support-for-FP16-vector-type---embracing-machine-learning-efficiency" class="common-anchor-header">Suporte para o tipo de vetor FP16 - abraçando a eficiência da aprendizagem automática<button data-href="#Support-for-FP16-vector-type---embracing-machine-learning-efficiency" class="anchor-icon" translate="no">
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
    </button></h2><p>O Milvus 2.3.2 e versões posteriores suportam agora o tipo de vetor FP16 ao nível da interface. O FP16, ou ponto flutuante de 16 bits, é um formato de dados amplamente utilizado na aprendizagem profunda e na aprendizagem automática, proporcionando uma representação e um cálculo eficientes dos valores numéricos. Embora o suporte total para FP16 esteja em andamento, vários índices na camada de indexação exigem a conversão de FP16 para FP32 durante a construção.</p>
<p>Iremos suportar totalmente os tipos de dados FP16, BF16 e int8 em versões posteriores do Milvus. Fique atento.</p>
<h2 id="Significant-improvement-in-the-rolling-upgrade-experience---seamless-transition-for-users" class="common-anchor-header">Melhoria significativa na experiência de atualização contínua - transição perfeita para os utilizadores<button data-href="#Significant-improvement-in-the-rolling-upgrade-experience---seamless-transition-for-users" class="anchor-icon" translate="no">
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
    </button></h2><p>A atualização contínua é uma caraterística crítica para os sistemas distribuídos, permitindo actualizações do sistema sem interromper os serviços comerciais ou sofrer períodos de inatividade. Nas últimas versões do Milvus, reforçámos a funcionalidade de atualização contínua do Milvus, assegurando uma transição mais simplificada e eficiente para os utilizadores que actualizam da versão 2.2.15 para a 2.3.3 e todas as versões posteriores. A comunidade também investiu em testes e optimizações extensivos, reduzindo o impacto da consulta durante a atualização para menos de 5 minutos, proporcionando aos utilizadores uma experiência sem problemas.</p>
<h2 id="Performance-optimization" class="common-anchor-header">Otimização do desempenho<button data-href="#Performance-optimization" class="anchor-icon" translate="no">
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
    </button></h2><p>Para além da introdução de novas funcionalidades, optimizámos significativamente o desempenho do Milvus nas duas últimas versões.</p>
<ul>
<li><p>Minimização das operações de cópia de dados para um carregamento de dados optimizado</p></li>
<li><p>Simplificámos as inserções de grande capacidade utilizando a leitura varchar em lote</p></li>
<li><p>Remoção de verificações de deslocamento desnecessárias durante o preenchimento de dados para melhorar o desempenho da fase de recuperação.</p></li>
<li><p>Resolveu problemas de alto consumo de CPU em cenários com inserções substanciais de dados</p></li>
</ul>
<p>Estas optimizações contribuem coletivamente para uma experiência Milvus mais rápida e eficiente. Consulte o nosso painel de controlo para ver como o Milvus melhorou o seu desempenho.</p>
<h2 id="Incompatible-changes" class="common-anchor-header">Alterações incompatíveis<button data-href="#Incompatible-changes" class="anchor-icon" translate="no">
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
<li><p>Código relacionado com o TimeTravel permanentemente eliminado.</p></li>
<li><p>Suporte obsoleto para MySQL como armazenamento de metadados.</p></li>
</ul>
<p>Consulte as <a href="https://milvus.io/docs/release_notes.md">notas de lançamento do Milvus</a> para obter informações mais detalhadas sobre todas as novas funcionalidades e melhorias.</p>
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
    </button></h2><p>Com as últimas versões do Milvus 2.3.2 e 2.3.3, estamos empenhados em fornecer uma solução de base de dados robusta, rica em funcionalidades e de elevado desempenho. Explore estas novas funcionalidades, tire partido das optimizações e junte-se a nós nesta viagem emocionante à medida que evoluímos o Milvus para satisfazer as exigências da gestão de dados moderna. Descarregue a versão mais recente agora e experimente o futuro do armazenamento de dados com Milvus!</p>
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
    </button></h2><p>Se tiver perguntas ou comentários sobre Milvus, junte-se ao nosso <a href="https://discord.com/invite/8uyFbECzPX">canal Discord</a> para interagir diretamente com os nossos engenheiros e a comunidade ou junte-se ao nosso <a href="https://discord.com/invite/RjNbk8RR4f">Milvus Community Lunch and Learn</a> todas as terças-feiras das 12-12:30 PM PST. Também pode seguir-nos no <a href="https://twitter.com/milvusio">Twitter</a> ou no <a href="https://www.linkedin.com/company/the-milvus-project">LinkedIn</a> para obter as últimas notícias e actualizações sobre Milvus.</p>
