---
id: 2022-02-28-how-milvus-balances-query-load-across-nodes.md
title: Como é que o Milvus equilibra a carga das consultas nos nós?
author: Xi Ge
date: 2022-02-28T00:00:00.000Z
desc: >-
  O Milvus 2.0 suporta o equilíbrio automático de carga entre os nós de
  consulta.
cover: assets.zilliz.com/Load_balance_b2f35a5577.png
tag: Engineering
tags: 'Data science, Database, Technology, Artificial Intelligence, Vector Management'
canonicalUrl: >-
  https://milvus.io/blog/2022-02-28-how-milvus-balances-query-load-across-nodes.md
---
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Load_balance_b2f35a5577.png" alt="Binlog Cover Image" class="doc-image" id="binlog-cover-image" />
   </span> <span class="img-wrapper"> <span>Imagem de capa do Binlog</span> </span></p>
<p>Por <a href="https://github.com/xige-16">Xi Ge</a>.</p>
<p>Em artigos anteriores do blogue, introduzimos sucessivamente as funções Deletion, Bitset e Compaction no Milvus 2.0. Para culminar esta série, gostaríamos de partilhar o design por detrás do Load Balance, uma função vital no cluster distribuído do Milvus.</p>
<h2 id="Implementation" class="common-anchor-header">Implementação<button data-href="#Implementation" class="anchor-icon" translate="no">
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
    </button></h2><p>Enquanto o número e o tamanho dos segmentos armazenados em buffer nos nós de consulta diferem, o desempenho da pesquisa nos nós de consulta também pode variar. O pior caso pode acontecer quando alguns nós de pesquisa estão esgotados a pesquisar uma grande quantidade de dados, mas os nós de pesquisa recém-criados permanecem inactivos porque nenhum segmento lhes é distribuído, causando um enorme desperdício de recursos da CPU e uma enorme queda no desempenho da pesquisa.</p>
<p>Para evitar tais circunstâncias, o coordenador da consulta (query coord) é programado para distribuir segmentos uniformemente para cada nó de consulta de acordo com o uso de RAM dos nós. Assim, os recursos da CPU são consumidos igualmente entre os nós, melhorando significativamente o desempenho da pesquisa.</p>
<h3 id="Trigger-automatic-load-balance" class="common-anchor-header">Acionar o balanceamento de carga automático</h3><p>De acordo com o valor predefinido da configuração <code translate="no">queryCoord.balanceIntervalSeconds</code>, a coordenação da consulta verifica a utilização da RAM (em percentagem) de todos os nós de consulta a cada 60 segundos. Se uma das seguintes condições for satisfeita, o coordenador de consultas começa a equilibrar a carga de consultas no nó de consulta:</p>
<ol>
<li>A utilização de RAM de qualquer nó de consulta no cluster é superior a <code translate="no">queryCoord.overloadedMemoryThresholdPercentage</code> (predefinição: 90);</li>
<li>Ou o valor absoluto da diferença de uso de RAM de quaisquer dois nós de consulta é maior que <code translate="no">queryCoord.memoryUsageMaxDifferencePercentage</code> (padrão: 30).</li>
</ol>
<p>Depois de os segmentos serem transferidos do nó de consulta de origem para o nó de consulta de destino, devem também satisfazer as duas condições seguintes:</p>
<ol>
<li>A utilização de RAM do nó de consulta de destino não é superior a <code translate="no">queryCoord.overloadedMemoryThresholdPercentage</code> (predefinição: 90);</li>
<li>O valor absoluto da diferença de uso de RAM dos nós de consulta de origem e destino após o balanceamento de carga é menor do que antes do balanceamento de carga.</li>
</ol>
<p>Com as condições acima satisfeitas, a coordenação da consulta procede ao equilíbrio da carga da consulta entre os nós.</p>
<h2 id="Load-balance" class="common-anchor-header">Equilíbrio da carga<button data-href="#Load-balance" class="anchor-icon" translate="no">
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
    </button></h2><p>Quando o equilíbrio da carga é acionado, o coordenador da consulta carrega primeiro o(s) segmento(s) de destino para o nó de consulta de destino. Ambos os nós de consulta devolvem os resultados de pesquisa do(s) segmento(s) de destino em qualquer pedido de pesquisa neste ponto para garantir a integralidade do resultado.</p>
<p>Depois de o nó de consulta de destino carregar com êxito o segmento de destino, o coordenador da consulta publica um <code translate="no">sealedSegmentChangeInfo</code> no canal de consulta. Como se mostra abaixo, <code translate="no">onlineNodeID</code> e <code translate="no">onlineSegmentIDs</code> indicam o nó de consulta que carrega o segmento e o segmento carregado, respetivamente, e <code translate="no">offlineNodeID</code> e <code translate="no">offlineSegmentIDs</code> indicam o nó de consulta que precisa de libertar o segmento e o segmento a libertar, respetivamente.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/20220228_145413_f253cec15b.png" alt="sealedSegmentChangeInfo" class="doc-image" id="sealedsegmentchangeinfo" />
   </span> <span class="img-wrapper"> <span>sealedSegmentChangeInfo</span> </span></p>
<p>Tendo recebido o <code translate="no">sealedSegmentChangeInfo</code>, o nó de consulta de origem liberta então o segmento de destino.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/20220228_145436_2604bc57a5.png" alt="Load Balance Workflow" class="doc-image" id="load-balance-workflow" />
   </span> <span class="img-wrapper"> <span>Fluxo de trabalho de balanceamento de carga</span> </span></p>
<p>Todo o processo é bem sucedido quando o nó de consulta de origem liberta o segmento de destino. Ao completar isso, a carga da consulta é definida como balanceada entre os nós de consulta, o que significa que o uso de RAM de todos os nós de consulta não é maior que <code translate="no">queryCoord.overloadedMemoryThresholdPercentage</code>, e o valor absoluto da diferença de uso de RAM dos nós de consulta de origem e destino após o balanceamento de carga é menor que antes do balanceamento de carga.</p>
<h2 id="Whats-next" class="common-anchor-header">O que vem a seguir?<button data-href="#Whats-next" class="anchor-icon" translate="no">
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
    </button></h2><p>No blogue da série de novas funcionalidades 2.0, pretendemos explicar a conceção das novas funcionalidades. Leia mais nesta série de blogues!</p>
<ul>
<li><a href="https://milvus.io/blog/2022-02-07-how-milvus-deletes-streaming-data-in-distributed-cluster.md">Como o Milvus elimina dados em fluxo contínuo num cluster distribuído</a></li>
<li><a href="https://milvus.io/blog/2022-2-21-compact.md">Como compactar dados no Milvus?</a></li>
<li><a href="https://milvus.io/blog/2022-02-28-how-milvus-balances-query-load-across-nodes.md">Como o Milvus equilibra a carga de consultas entre os nós?</a></li>
<li><a href="https://milvus.io/blog/2022-2-14-bitset.md">Como o Bitset permite a versatilidade da pesquisa de similaridade de vetores</a></li>
</ul>
<p>Este é o final da série de blogues de novas funcionalidades do Milvus 2.0. Após esta série, estamos a planear uma nova série de Milvus <a href="https://milvus.io/blog/deep-dive-1-milvus-architecture-overview.md">Deep Dive</a>, que introduz a arquitetura básica do Milvus 2.0. Por favor, fique atento.</p>
