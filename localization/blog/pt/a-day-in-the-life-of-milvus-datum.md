---
id: a-day-in-the-life-of-milvus-datum.md
title: Um dia na vida de um Milvus Datum
author: 'Stefan Webb, Anthony Tu'
date: 2025-03-17T00:00:00.000Z
desc: 'Então, vamos dar um passeio num dia na vida de Dave, o dado Milvus.'
cover: assets.zilliz.com/a_day_in_the_life_of_a_milvus_datum_ca279f7f59.png
tag: Engineering
tags: 'Deep Research, open source AI, Milvus, LangChain, DeepSeek R1'
recommend: true
canonicalUrl: 'https://milvus.io/blog/a-day-in-the-life-of-milvus-datum.md'
---
<p>Construir uma <a href="https://zilliz.com/learn/what-is-vector-database">base de dados de vectores</a> com bom desempenho como o Milvus, que pode atingir milhares de milhões de vectores e lidar com tráfego à escala da Web, não é tarefa fácil. Requer a conceção cuidadosa e inteligente de um sistema distribuído. Necessariamente, haverá um compromisso entre desempenho e simplicidade nos componentes internos de um sistema como este.</p>
<p>Embora tenhamos tentado equilibrar bem este compromisso, alguns aspectos internos permaneceram opacos. Este artigo tem como objetivo dissipar qualquer mistério sobre a forma como o Milvus divide a inserção de dados, a indexação e o serviço entre nós. Compreender estes processos a um nível elevado é essencial para otimizar eficazmente o desempenho das consultas, a estabilidade do sistema e a depuração de problemas relacionados.</p>
<p>Então, vamos dar um passeio em um dia na vida de Dave, o dado Milvus. Imagine que insere o Dave na sua coleção numa <a href="https://milvus.io/docs/install-overview.md#Milvus-Distributed">implementação Milvus Distributed</a> (ver o diagrama abaixo). No que lhe diz respeito, ele vai diretamente para a coleção. No entanto, nos bastidores, ocorrem muitos passos em subsistemas independentes.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/a_day_in_the_life_of_a_milvus_datum_ca279f7f59.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Proxy-Nodes-and-the-Message-Queue" class="common-anchor-header">Nós proxy e a fila de mensagens<button data-href="#Proxy-Nodes-and-the-Message-Queue" class="anchor-icon" translate="no">
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
    </button></h2><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Proxy_Nodes_and_the_Message_Queue_03a0fde0c5.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Inicialmente, chama-se o objeto MilvusClient, por exemplo, através da biblioteca PyMilvus, e envia-se um pedido <code translate="no">_insert()</code>_ para um <em>nó proxy</em>. Os nós proxy são a porta de entrada entre o utilizador e o sistema de base de dados, executando operações como o balanceamento de carga no tráfego de entrada e agrupando várias saídas antes de serem devolvidas ao utilizador.</p>
<p>Uma função hash é aplicada à chave primária do item para determinar para qual <em>canal</em> enviá-lo. Os canais, implementados com tópicos do Pulsar ou do Kafka, representam um local de retenção para dados de streaming, que podem então ser enviados para os assinantes do canal.</p>
<h2 id="Data-Nodes-Segments-and-Chunks" class="common-anchor-header">Nós, segmentos e pedaços de dados<button data-href="#Data-Nodes-Segments-and-Chunks" class="anchor-icon" translate="no">
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
    </button></h2><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Data_Nodes_Segments_and_Chunks_ae122dd1ac.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Após os dados terem sido enviados para o canal apropriado, o canal os envia para o segmento correspondente no <em>nó de dados</em>. Os nós de dados são responsáveis por armazenar e gerenciar buffers de dados chamados <em>segmentos crescentes</em>. Há um segmento de crescimento por fragmento.</p>
<p>À medida que os dados são inseridos em um segmento, o segmento cresce em direção a um tamanho máximo, que por padrão é de 122MB. Durante esse tempo, partes menores do segmento, por padrão 16MB e conhecidas como <em>chunks</em>, são empurradas para o armazenamento persistente, por exemplo, usando o S3 da AWS ou outro armazenamento compatível como o MinIO. Cada pedaço é um ficheiro físico no armazenamento de objectos e existe um ficheiro separado por campo. Veja a figura acima que ilustra a hierarquia de ficheiros no armazenamento de objectos.</p>
<p>Assim, para resumir, os dados de uma coleção são divididos em nós de dados, dentro dos quais são divididos em segmentos para armazenamento em buffer, que são ainda divididos em pedaços por campo para armazenamento persistente. Os dois diagramas acima tornam isto mais claro. Ao dividir os dados de entrada desta forma, exploramos totalmente o paralelismo do cluster de largura de banda de rede, computação e armazenamento.</p>
<h2 id="Sealing-Merging-and-Compacting-Segments" class="common-anchor-header">Selagem, fusão e compactação de segmentos<button data-href="#Sealing-Merging-and-Compacting-Segments" class="anchor-icon" translate="no">
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
    </button></h2><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Sealing_Merging_and_Compacting_Segments_d5a6a37261.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Até agora, contámos a história de como o nosso simpático dado Dave passa de uma consulta <code translate="no">_insert()</code>_ para o armazenamento persistente. É claro que sua história não termina aí. Existem outros passos para tornar o processo de pesquisa e indexação mais eficiente. Ao gerir o tamanho e o número de segmentos, o sistema explora totalmente o paralelismo do cluster.</p>
<p>Quando um segmento atinge o seu tamanho máximo num nó de dados, por defeito 122MB, diz-se que está <em>selado</em>. O que isso significa é que o buffer no nó de dados é limpo para dar lugar a um novo segmento, e os pedaços correspondentes no armazenamento persistente são marcados como pertencentes a um segmento fechado.</p>
<p>Os nós de dados procuram periodicamente segmentos selados mais pequenos e fundem-nos em segmentos maiores até atingirem um tamanho máximo de 1 GB (por defeito) por segmento. Recorde-se que quando um item é eliminado no Milvus, é simplesmente marcado com um sinal de eliminação - pense nisto como o corredor da morte para o Dave. Quando o número de itens apagados num segmento ultrapassa um determinado limite, por defeito 20%, o segmento é reduzido em tamanho, uma operação a que chamamos <em>compactação</em>.</p>
<p>Indexação e pesquisa em segmentos</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Indexing_and_Searching_through_Segments_478c0067be.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Indexing_and_Searching_through_Segments_1_0c31b5a340.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Existe um tipo de nó adicional, o <em>nó de índice</em>, que é responsável pela construção de índices para segmentos selados. Quando o segmento é selado, o nó de dados envia uma solicitação para um nó de índice para construir um índice. O nó de índice então envia o índice completo para o armazenamento de objetos. Cada segmento selado tem seu próprio índice armazenado em um arquivo separado. É possível examinar esse arquivo manualmente, acessando o bucket - veja a figura acima para a hierarquia do arquivo.</p>
<p>Os nós de consulta - não apenas os nós de dados - subscrevem os tópicos da fila de mensagens para os fragmentos correspondentes. Os segmentos crescentes são replicados nos nós de consulta, e o nó carrega na memória os segmentos selados pertencentes à coleção, conforme necessário. Ele constrói um índice para cada segmento crescente à medida que os dados chegam e carrega os índices finalizados para os segmentos selados do armazenamento de dados.</p>
<p>Imagine agora que chama o objeto MilvusClient com um pedido <em>search()</em> que engloba o Dave. Depois de ser encaminhado para todos os nós de consulta através do nó proxy, cada nó de consulta executa uma pesquisa de similaridade de vetor (ou outro método de pesquisa como consulta, pesquisa de intervalo ou pesquisa de agrupamento), iterando sobre os segmentos um por um. Os resultados são agrupados entre os nós de uma forma semelhante ao MapReduce e enviados de volta ao utilizador, estando Dave feliz por se encontrar finalmente reunido consigo.</p>
<h2 id="Discussion" class="common-anchor-header">Discussão<button data-href="#Discussion" class="anchor-icon" translate="no">
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
    </button></h2><p>Cobrimos um dia na vida de Dave, o dado, tanto para as operações <code translate="no">_insert()</code>_ como para <code translate="no">_search()</code>_. Outras operações como <code translate="no">_delete()</code>_ e <code translate="no">_upsert()</code>_ funcionam de forma semelhante. Inevitavelmente, tivemos de simplificar a nossa discussão e omitir pormenores. No entanto, no geral, deve ter agora uma imagem suficiente de como o Milvus foi concebido para que o paralelismo entre nós num sistema distribuído seja robusto e eficiente, e como pode utilizar isto para otimização e depuração.</p>
<p><em>Uma conclusão importante deste artigo: O Milvus foi concebido com uma separação de preocupações entre os tipos de nós. Cada tipo de nó tem uma função específica e mutuamente exclusiva, e há uma separação entre armazenamento e computação.</em> O resultado é que cada componente pode ser escalado de forma independente com parâmetros ajustáveis de acordo com o caso de uso e os padrões de tráfego. Por exemplo, é possível escalonar o número de nós de consulta para atender ao aumento do tráfego sem escalonar os nós de dados e de índice. Com esta flexibilidade, há utilizadores do Milvus que lidam com milhares de milhões de vectores e servem tráfego à escala da Web, com latência de consulta inferior a 100 ms.</p>
<p>Também pode usufruir das vantagens do design distribuído do Milvus sem sequer implementar um cluster distribuído através do <a href="https://zilliz.com/cloud">Zilliz Cloud</a>, um serviço totalmente gerido do Milvus. <a href="https://cloud.zilliz.com/signup">Inscreva-se hoje mesmo no nível gratuito do Zilliz Cloud e ponha Dave em ação!</a></p>
