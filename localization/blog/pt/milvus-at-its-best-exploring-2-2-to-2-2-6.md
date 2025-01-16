---
id: milvus-at-its-best-exploring-2-2-to-2-2-6.md
title: 'Milvus no seu melhor: Explorando a v2.2 para a v2.2.6'
author: Fendy Feng
date: 2023-04-22T00:00:00.000Z
cover: assets.zilliz.com/explore_milvus_latest_versions_48a4138d02.png
tag: News
tags: >-
  Milvus, Vector Database, Open Source, Data science, Artificial Intelligence,
  Vector Management
desc: O que há de novo no Milvus 2.2 para 2.2.6
recommend: true
canonicalUrl: 'https://milvus.io/blog/milvus-at-its-best-exploring-2-2-to-2-2-6.md'
---
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/exploring_milvus_latest_versions_4fa890533e.png" alt="Milvus at Its Best" class="doc-image" id="milvus-at-its-best" />
   </span> <span class="img-wrapper"> <span>Milvus no seu melhor</span> </span></p>
<p>Bem-vindos de volta, seguidores do Milvus! Sabemos que já passou algum tempo desde a última vez que partilhámos as nossas actualizações sobre esta base de dados vetorial de código aberto de ponta. Mas não tenham medo, porque estamos aqui para os pôr a par de todos os desenvolvimentos interessantes que tiveram lugar desde agosto passado.</p>
<p>Nesta publicação do blogue, vamos levá-lo a conhecer os últimos lançamentos do Milvus, desde a versão 2.2 até à versão 2.2.6. Temos muito para cobrir, incluindo novas funcionalidades, melhorias, correcções de erros e optimizações. Por isso, apertem os cintos de segurança e vamos lá!</p>
<h2 id="Milvus-v22-a-major-release-with-enhanced-stability-faster-search-speed-and-flexible-scalability" class="common-anchor-header">Milvus v2.2: uma versão importante com maior estabilidade, maior velocidade de pesquisa e escalabilidade flexível<button data-href="#Milvus-v22-a-major-release-with-enhanced-stability-faster-search-speed-and-flexible-scalability" class="anchor-icon" translate="no">
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
    </button></h2><p>O Milvus v2.2 é uma versão significativa que introduz sete novas funcionalidades e numerosas melhorias relativamente às versões anteriores. Vamos dar uma olhada em alguns dos destaques:</p>
<ul>
<li><strong>Inserção em massa de entidades a partir de ficheiros</strong>: Com esta funcionalidade, pode carregar um lote de entidades de um ou vários ficheiros diretamente para o Milvus com apenas algumas linhas de código, poupando-lhe tempo e esforço.</li>
<li><strong>Paginação de resultados de pesquisas</strong>: Para evitar o retorno massivo de resultados de pesquisas e consultas numa única chamada de procedimento remoto (RPC), o Milvus v2.2 permite-lhe configurar a paginação e filtrar resultados com palavras-chave em pesquisas e consultas.</li>
<li><strong>Controlo de Acesso Baseado em Funções (RBAC)</strong>: O Milvus v2.2 suporta agora o RBAC, permitindo-lhe controlar o acesso à sua instância Milvus através da gestão de utilizadores, funções e permissões.</li>
<li><strong>Cotas e limites</strong>: Cotas e limites é um novo mecanismo no Milvus v2.2 que protege o sistema de banco de dados contra erros de falta de memória (OOM) e falhas durante picos repentinos de tráfego. Com esta funcionalidade, é possível controlar a ingestão, a pesquisa e a utilização da memória.</li>
<li><strong>Time to Live (TTL) a nível de coleção</strong>: Em versões anteriores, o Milvus só permitia a configuração do TTL para os clusters. No entanto, o Milvus v2.2 agora suporta a configuração do TTL no nível da coleção. Configurando o TTL para uma coleção específica, as entidades nessa coleção expirarão automaticamente após o término do TTL. Esta configuração fornece um controlo mais fino sobre a retenção de dados.</li>
<li><strong>Índices ANNS (Approximate Nearest Neighbor Search) baseados em disco (Beta)</strong>: O Milvus v2.2 introduz o suporte para DiskANN, um algoritmo ANNS baseado em gráficos Vamana e residente em SSD. Este suporte permite a pesquisa direta em conjuntos de dados de grande escala, o que pode reduzir significativamente a utilização de memória, até 10 vezes.</li>
<li><strong>Backup de dados (Beta)</strong>: Milvus v2.2 fornece <a href="https://github.com/zilliztech/milvus-backup">uma nova ferramenta</a> para fazer backup e restaurar seus dados Milvus corretamente, seja através de uma linha de comando ou um servidor API.</li>
</ul>
<p>Para além das novas funcionalidades mencionadas acima, o Milvus v2.2 inclui correcções para cinco bugs e várias melhorias para melhorar a estabilidade, observabilidade e desempenho do Milvus. Para obter mais detalhes, consulte <a href="https://milvus.io/docs/release_notes.md#v220">as Notas de lançamento do Milvus v2.2</a>.</p>
<h2 id="Milvus-v221--v222-minor-releases-with-issues-fixed" class="common-anchor-header">Milvus v2.2.1 &amp; v2.2.2: versões menores com problemas corrigidos<button data-href="#Milvus-v221--v222-minor-releases-with-issues-fixed" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus v2.2.1 e v2.2.2 são versões menores que se concentram na correção de problemas críticos das versões anteriores e na introdução de novas funcionalidades. Eis alguns destaques:</p>
<h3 id="Milvus-v221" class="common-anchor-header">Milvus v2.2.1</h3><ul>
<li>Suporta inquilino e autenticação Pulsa</li>
<li>Suporta segurança da camada de transporte (TLS) na fonte de configuração etcd</li>
<li>Melhora o desempenho da pesquisa em mais de 30%</li>
<li>Optimiza o agendador e aumenta a probabilidade de tarefas de fusão</li>
<li>Corrige vários erros, incluindo falhas de filtragem de termos em campos escalares indexados e IndexNode panic após falhas na criação de um índice</li>
</ul>
<h3 id="Milvus-v222" class="common-anchor-header">Milvus v2.2.2</h3><ul>
<li>Corrige o problema em que o proxy não actualiza a cache de líderes de fragmentos</li>
<li>Corrige o problema de que as informações carregadas não são limpas para coleções/partições liberadas</li>
<li>Corrige o problema em que a contagem de carga não é limpa a tempo</li>
</ul>
<p>Para obter mais detalhes, consulte <a href="https://milvus.io/docs/release_notes.md#v221">as Notas de lançamento do Milvus v2.2.1</a> e <a href="https://milvus.io/docs/release_notes.md#v222">as Notas de lançamento do Milvus v2.2.2</a>.</p>
<h2 id="Milvus-v223-more-secure-stable-and-available" class="common-anchor-header">Milvus v2.2.3: mais seguro, estável e disponível<button data-href="#Milvus-v223-more-secure-stable-and-available" class="anchor-icon" translate="no">
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
    </button></h2><p>O Milvus v2.2.3 é uma versão que se concentra em melhorar a segurança, a estabilidade e a disponibilidade do sistema. Para além disso, introduz duas funcionalidades importantes:</p>
<ul>
<li><p><strong>Atualização contínua</strong>: Esta funcionalidade permite ao Milvus responder aos pedidos recebidos durante o processo de atualização, o que era impossível nas versões anteriores. As actualizações contínuas garantem que o sistema permanece disponível e responde aos pedidos dos utilizadores mesmo durante as actualizações.</p></li>
<li><p><strong>Alta disponibilidade do coordenador (HA)</strong>: Esta funcionalidade permite que os coordenadores do Milvus trabalhem em modo de espera ativa, reduzindo o risco de falhas num único ponto. Mesmo em caso de catástrofes inesperadas, o tempo de recuperação é reduzido para um máximo de 30 segundos.</p></li>
</ul>
<p>Para além destas novas funcionalidades, o Milvus v2.2.3 inclui numerosas melhorias e correcções de erros, incluindo um melhor desempenho de inserção em massa, uma utilização de memória reduzida, métricas de monitorização optimizadas e um melhor desempenho de meta-armazenamento. Para obter mais detalhes, consulte <a href="https://milvus.io/docs/release_notes.md#v223">as Notas de versão do Milvus v2.2.3</a>.</p>
<h2 id="Milvus-v224-faster-more-reliable-and-resource-saving" class="common-anchor-header">Milvus v2.2.4: mais rápido, mais fiável e com economia de recursos<button data-href="#Milvus-v224-faster-more-reliable-and-resource-saving" class="anchor-icon" translate="no">
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
    </button></h2><p>O Milvus v2.2.4 é uma pequena atualização do Milvus v2.2. Introduz quatro novas funcionalidades e várias melhorias, resultando num desempenho mais rápido, maior fiabilidade e menor consumo de recursos. Os destaques desta versão incluem:</p>
<ul>
<li><strong>Agrupamento de recursos</strong>: O Milvus agora suporta o agrupamento de QueryNodes em outros grupos de recursos, permitindo o isolamento completo do acesso a recursos físicos em diferentes grupos.</li>
<li><strong>Renomeação de colecções</strong>: A API de renomeação de colecções permite aos utilizadores alterar o nome de uma coleção, proporcionando mais flexibilidade na gestão de colecções e melhorando a usabilidade.</li>
<li><strong>Suporte para o Google Cloud Storage</strong></li>
<li><strong>Nova opção nas APIs de pesquisa e consulta</strong>: Esta nova funcionalidade permite aos utilizadores ignorar a pesquisa em todos os segmentos em crescimento, oferecendo um melhor desempenho de pesquisa em cenários em que a pesquisa é realizada em simultâneo com a inserção de dados.</li>
</ul>
<p>Para mais informações, consulte <a href="https://milvus.io/docs/release_notes.md#v224">as notas de lançamento do Milvus v2.2.4</a>.</p>
<h2 id="Milvus-v225-NOT-RECOMMENDED" class="common-anchor-header">Milvus v2.2.5: NÃO RECOMENDADO<button data-href="#Milvus-v225-NOT-RECOMMENDED" class="anchor-icon" translate="no">
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
    </button></h2><p>O Milvus v2.2.5 apresenta vários problemas críticos, pelo que não recomendamos a utilização desta versão.  Pedimos sinceras desculpas por qualquer inconveniente causado por eles. No entanto, esses problemas foram resolvidos no Milvus v2.2.6.</p>
<h2 id="Milvus-v226-resolves-critical-issues-from-v225" class="common-anchor-header">Milvus v2.2.6: resolve problemas críticos da v2.2.5<button data-href="#Milvus-v226-resolves-critical-issues-from-v225" class="anchor-icon" translate="no">
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
    </button></h2><p>O Milvus v2.2.6 resolveu com sucesso os problemas críticos descobertos na v2.2.5, incluindo problemas com a reciclagem de dados sujos do binlog e a falha do DataCoord GC. Se utiliza atualmente a versão 2.2.5, actualize-a para garantir um desempenho e estabilidade ideais.</p>
<p>Os problemas críticos corrigidos incluem:</p>
<ul>
<li>Falha no DataCoord GC</li>
<li>Substituição de parâmetros de índice passados</li>
<li>Atraso do sistema causado por acumulação de mensagens do RootCoord</li>
<li>Imprecisão da métrica RootCoordInsertChannelTimeTick</li>
<li>Possível paragem do carimbo de data/hora</li>
<li>Auto-destruição ocasional da função de coordenador durante o processo de reinício</li>
<li>Os pontos de controlo ficam para trás devido à saída anormal da recolha de lixo</li>
</ul>
<p>Para obter mais detalhes, consulte <a href="https://milvus.io/docs/release_notes.md#v226">as Notas de versão do Milvus v2.2.6</a>.</p>
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
    </button></h2><p>Concluindo, as últimas versões do Milvus, da v2.2 à v2.2.6, forneceram muitas atualizações e melhorias interessantes. Desde novas funcionalidades a correcções de erros e optimizações, a Milvus continua a cumprir o seu compromisso de fornecer soluções de ponta e potenciar aplicações em vários domínios. Fique atento a mais actualizações e inovações interessantes da comunidade Milvus.</p>
