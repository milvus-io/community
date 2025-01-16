---
id: dynamic-data-update-and-query-milvus.md
title: Preparação
author: milvus
date: 2020-04-13T21:02:08.632Z
desc: A pesquisa de vectores é agora mais intuitiva e conveniente
cover: assets.zilliz.com/header_62d7b8c823.png
tag: Engineering
canonicalUrl: 'https://zilliz.com/blog/dynamic-data-update-and-query-milvus'
---
<custom-h1>Como o Milvus implementa a atualização e consulta dinâmica de dados</custom-h1><p>Neste artigo, iremos descrever principalmente a forma como os dados vectoriais são registados na memória do Milvus, e como estes registos são mantidos.</p>
<p>Abaixo estão os nossos principais objectivos de conceção:</p>
<ol>
<li>A eficiência da importação de dados deve ser elevada.</li>
<li>Os dados podem ser vistos o mais rapidamente possível após a sua importação.</li>
<li>Evitar a fragmentação dos ficheiros de dados.</li>
</ol>
<p>Por conseguinte, criámos uma memória intermédia (memória intermédia de inserção) para inserir os dados, a fim de reduzir o número de comutações de contexto de E/S aleatórias no disco e no sistema operativo para melhorar o desempenho da inserção de dados. A arquitetura de armazenamento em memória baseada em MemTable e MemTableFile permite-nos gerir e serializar os dados de forma mais conveniente. O estado do buffer é dividido em Mutável e Imutável, o que permite que os dados sejam persistidos no disco, mantendo os serviços externos disponíveis.</p>
<h2 id="Preparation" class="common-anchor-header">Preparação<button data-href="#Preparation" class="anchor-icon" translate="no">
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
    </button></h2><p>Quando o utilizador está pronto para inserir um vetor no Milvus, precisa primeiro de criar uma Collection (* O Milvus renomeia Table para Collection na versão 0.7.0). A coleção é a unidade mais básica para registar e pesquisar vectores no Milvus.</p>
<p>Cada coleção tem um nome único e algumas propriedades que podem ser definidas, e os vectores são inseridos ou pesquisados com base no nome da coleção. Ao criar uma nova coleção, o Milvus regista a informação dessa coleção nos metadados.</p>
<h2 id="Data-Insertion" class="common-anchor-header">Inserção de dados<button data-href="#Data-Insertion" class="anchor-icon" translate="no">
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
    </button></h2><p>Quando o utilizador envia um pedido de inserção de dados, os dados são serializados e desserializados para chegar ao servidor Milvus. Os dados são agora escritos em memória. A escrita em memória divide-se, grosso modo, nas seguintes etapas:</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/2_data_insertion_milvus_99448bae50.png" alt="2-data-insertion-milvus.png" class="doc-image" id="2-data-insertion-milvus.png" />
   </span> <span class="img-wrapper"> <span>2-data-insertion-milvus.png</span> </span></p>
<ol>
<li>No MemManager, localize ou crie uma nova MemTable correspondente ao nome da coleção. Cada MemTable corresponde a um buffer da Coleção na memória.</li>
<li>Uma MemTable conterá um ou mais MemTableFile. Sempre que criamos um novo MemTableFile, registamos essa informação no Meta ao mesmo tempo. Dividimos os MemTableFile em dois estados: Mutável e Imutável. Quando o tamanho do MemTableFile atinge o limite, torna-se Imutável. Cada MemTable só pode ter um MemTableFile Mutável a ser escrito em qualquer altura.</li>
<li>Os dados de cada MemTableFile serão finalmente registados na memória no formato do tipo de índice definido. A MemTableFile é a unidade mais básica para gerir dados em memória.</li>
<li>Em qualquer altura, a utilização de memória dos dados inseridos não excederá o valor predefinido (insert_buffer_size). Isto porque, a cada pedido de inserção de dados, o MemManager pode facilmente calcular a memória ocupada pelo MemTableFile contido em cada MemTable e, em seguida, coordenar o pedido de inserção de acordo com a memória atual.</li>
</ol>
<p>Através da arquitetura multi-nível do MemManager, MemTable e MemTableFile, a inserção de dados pode ser melhor gerida e mantida. Naturalmente, eles podem fazer muito mais do que isso.</p>
<h2 id="Near-Real-time-Query" class="common-anchor-header">Consultas quase em tempo real<button data-href="#Near-Real-time-Query" class="anchor-icon" translate="no">
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
    </button></h2><p>No Milvus, só é necessário esperar um segundo, no máximo, para que os dados inseridos passem da memória para o disco. Todo esse processo pode ser resumido na figura a seguir:</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/2_near_real_time_query_milvus_f3cfdd00fb.png" alt="2-near-real-time-query-milvus.png" class="doc-image" id="2-near-real-time-query-milvus.png" />
   </span> <span class="img-wrapper"> <span>2-near-real-time-query-milvus.png</span> </span></p>
<p>Primeiro, os dados inseridos entrarão num buffer de inserção na memória. O buffer mudará periodicamente do estado Mutável inicial para o estado Imutável em preparação para a serialização. Em seguida, esses buffers imutáveis serão serializados para o disco periodicamente pelo thread de serialização em segundo plano. Depois de os dados serem colocados, a informação da ordem será registada nos metadados. Neste ponto, os dados podem ser pesquisados!</p>
<p>Agora, vamos descrever os passos da figura em pormenor.</p>
<p>Já conhecemos o processo de inserção de dados no buffer mutável. O próximo passo é mudar do buffer mutável para o buffer imutável:</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/3_mutable_buffer_immutable_buffer_milvus_282b66c5fe.png" alt="3-mutable-buffer-immutable-buffer-milvus.png" class="doc-image" id="3-mutable-buffer-immutable-buffer-milvus.png" />
   </span> <span class="img-wrapper"> <span>3-mutable-buffer-immutable-buffer-milvus.png</span> </span></p>
<p>A fila imutável fornecerá à thread de serialização em segundo plano o estado imutável e o MemTableFile que está pronto para ser serializado. Cada MemTable gerencia sua própria fila imutável, e quando o tamanho do único MemTableFile mutável da MemTable atinge o limite, ele entra na fila imutável. Uma thread em segundo plano responsável por ToImmutable irá periodicamente puxar todos os MemTableFiles na fila imutável gerenciada por MemTable e enviá-los para a fila total Immutable. É de notar que as duas operações de escrita de dados na memória e de alteração dos dados na memória para um estado que não pode ser escrito não podem ocorrer ao mesmo tempo, sendo necessário um bloqueio comum. No entanto, a operação de ToImmutable é muito simples e quase não causa qualquer atraso, pelo que o impacto no desempenho dos dados inseridos é mínimo.</p>
<p>O próximo passo é serializar o MemTableFile na fila de serialização para o disco. Isso é dividido principalmente em três etapas:</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/4_serialize_memtablefile_milvus_95766abdfb.png" alt="4-serialize-memtablefile-milvus.png" class="doc-image" id="4-serialize-memtablefile-milvus.png" />
   </span> <span class="img-wrapper"> <span>4-serialize-memtablefile-milvus.png</span> </span></p>
<p>Primeiro, a thread de serialização em segundo plano puxa periodicamente o MemTableFile da fila imutável. Em seguida, eles são serializados em arquivos brutos de tamanho fixo (Raw TableFiles). Por fim, registamos esta informação nos metadados. Quando efectuarmos uma pesquisa vetorial, consultaremos o TableFile correspondente nos metadados. A partir daqui, estes dados podem ser pesquisados!</p>
<p>Além disso, de acordo com o conjunto index_file_size, depois de o thread de serialização completar um ciclo de serialização, irá fundir alguns TableFiles de tamanho fixo num TableFile e também registar estas informações nos metadados. Neste momento, o TableFile pode ser indexado. A construção do índice também é assíncrona. Outro thread em segundo plano responsável pela construção do índice lerá periodicamente o TableFile no estado ToIndex dos metadados para executar a construção do índice correspondente.</p>
<h2 id="Vector-search" class="common-anchor-header">Pesquisa vetorial<button data-href="#Vector-search" class="anchor-icon" translate="no">
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
    </button></h2><p>De facto, verificará que, com a ajuda do TableFile e dos metadados, a pesquisa vetorial se torna mais intuitiva e conveniente. Em geral, precisamos de obter os TableFiles correspondentes à coleção consultada a partir dos metadados, pesquisar em cada TableFile e, por fim, fundir. Neste artigo, não nos aprofundamos na implementação específica da pesquisa.</p>
<p>Se quiser saber mais, pode ler o nosso código fonte, ou ler os nossos outros artigos técnicos sobre o Milvus!</p>
