---
id: in-memory-replicas.md
title: >-
  Aumente a taxa de transferência de leitura do banco de dados vetorial com
  réplicas na memória
author: Congqi Xia
date: 2022-08-22T00:00:00.000Z
desc: >-
  Utilizar réplicas na memória para melhorar o débito de leitura e a utilização
  de recursos de hardware.
cover: assets.zilliz.com/in_memory_replica_af1fa21d61.png
tag: Engineering
tags: 'Vector Database for AI, Artificial Intelligence, Machine Learning'
canonicalUrl: 'https://milvus.io/blog/in-memory-replicas.md'
---
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/in_memory_replica_af1fa21d61.png" alt="Cover_image" class="doc-image" id="cover_image" />
   </span> <span class="img-wrapper"> <span>Imagem da capa</span> </span></p>
<blockquote>
<p>Este artigo tem a coautoria de <a href="https://github.com/congqixia">Congqi Xia</a> e <a href="https://www.linkedin.com/in/yiyun-n-2aa713163/">Angela Ni</a>.</p>
</blockquote>
<p>Com o seu lançamento oficial, o Milvus 2.1 vem com muitas novas funcionalidades para proporcionar conveniência e uma melhor experiência de utilizador. Embora o conceito de réplica na memória não seja novidade no mundo das bases de dados distribuídas, é uma caraterística crítica que pode ajudá-lo a aumentar o desempenho do sistema e melhorar a disponibilidade do sistema de uma forma fácil. Portanto, esta postagem se propõe a explicar o que é a réplica na memória e por que ela é importante e, em seguida, apresenta como habilitar esse novo recurso no Milvus, um banco de dados vetorial para IA.</p>
<p><strong>Ir para:</strong></p>
<ul>
<li><p><a href="#Concepts-related-to-in-memory-replica">Conceitos relacionados com a réplica na memória</a></p></li>
<li><p><a href="#What-is-in-memory-replica">O que é a réplica na memória?</a></p></li>
<li><p><a href="#Why-are-in-memory-replicas-important">Porque é que as réplicas na memória são importantes?</a></p></li>
<li><p><a href="#Enable-in-memory-replicas-in-the-Milvus-vector-database">Ativar réplicas na memória na base de dados vetorial Milvus</a></p></li>
</ul>
<h2 id="Concepts-related-to-in-memory-replica" class="common-anchor-header">Conceitos relacionados com a réplica na memória<button data-href="#Concepts-related-to-in-memory-replica" class="anchor-icon" translate="no">
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
    </button></h2><p>Antes de saber o que é a réplica na memória e por que ela é importante, precisamos primeiro entender alguns conceitos relevantes, incluindo grupo de réplicas, réplica de fragmento, réplica de fluxo contínuo, réplica histórica e líder de fragmento. A imagem abaixo é uma ilustração desses conceitos.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/diagram_1_525afc706a.jpg" alt="Replica_concepts" class="doc-image" id="replica_concepts" />
   </span> <span class="img-wrapper"> <span>Conceitos de réplica</span> </span></p>
<h3 id="Replica-group" class="common-anchor-header">Grupo de réplicas</h3><p>Um grupo de réplicas consiste em vários <a href="https://milvus.io/docs/v2.1.x/four_layers.md#Query-node">nós de consulta</a> que são responsáveis pelo tratamento de dados históricos e réplicas.</p>
<h3 id="Shard-replica" class="common-anchor-header">Réplica de fragmento</h3><p>Uma réplica de fragmento é constituída por uma réplica de fluxo contínuo e uma réplica histórica, ambas pertencentes ao mesmo <a href="https://milvus.io/blog/deep-dive-1-milvus-architecture-overview.md#Shard">fragmento</a> (ou seja, canal DML). Várias réplicas de fragmentos constituem um grupo de réplicas. E o número exato de réplicas de fragmentos num grupo de réplicas é determinado pelo número de fragmentos numa coleção especificada.</p>
<h3 id="Streaming-replica" class="common-anchor-header">Réplica de fluxo contínuo</h3><p>Uma réplica de fluxo contínuo contém todos os <a href="https://milvus.io/docs/v2.1.x/glossary.md#Segment">segmentos crescentes</a> do mesmo canal DML. Tecnicamente falando, uma réplica de streaming deve ser servida por apenas um nó de consulta numa réplica.</p>
<h3 id="Historical-replica" class="common-anchor-header">Réplica histórica</h3><p>Uma réplica histórica contém todos os segmentos encerrados do mesmo canal DML. Os segmentos fechados de uma réplica histórica podem ser distribuídos em vários nós de consulta dentro do mesmo grupo de réplicas.</p>
<h3 id="Shard-leader" class="common-anchor-header">Líder de fragmento</h3><p>Um líder de fragmento é o nó de consulta que serve a réplica de fluxo numa réplica de fragmento.</p>
<h2 id="What-is-in-memory-replica" class="common-anchor-header">O que é a réplica na memória?<button data-href="#What-is-in-memory-replica" class="anchor-icon" translate="no">
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
    </button></h2><p>A ativação de réplicas na memória permite-lhe carregar dados numa coleção em vários nós de consulta para que possa tirar partido de recursos extra de CPU e memória. Esta funcionalidade é muito útil se tiver um conjunto de dados relativamente pequeno mas pretender aumentar o débito de leitura e melhorar a utilização dos recursos de hardware.</p>
<p>Por enquanto, o banco de dados vetorial Milvus mantém uma réplica para cada segmento na memória. No entanto, com réplicas na memória, é possível ter várias réplicas de um segmento em diferentes nós de consulta. Isto significa que se um nó de consulta estiver a efetuar uma pesquisa num segmento, um novo pedido de pesquisa que chegue pode ser atribuído a outro nó de consulta inativo, uma vez que este nó de consulta tem uma réplica exatamente do mesmo segmento.</p>
<p>Além disso, se tivermos várias réplicas na memória, podemos lidar melhor com a situação em que um nó de consulta falha. Antes, era preciso esperar que o segmento fosse recarregado para continuar a pesquisa em outro nó de consulta. No entanto, com a replicação em memória, o pedido de pesquisa pode ser reenviado para um novo nó de consulta imediatamente, sem ter de recarregar os dados novamente.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/replication_3_1_2c25513cb9.jpg" alt="Replication" class="doc-image" id="replication" />
   </span> <span class="img-wrapper"> <span>Replicação</span> </span></p>
<h2 id="Why-are-in-memory-replicas-important" class="common-anchor-header">Porque é que as réplicas na memória são importantes?<button data-href="#Why-are-in-memory-replicas-important" class="anchor-icon" translate="no">
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
    </button></h2><p>Uma das vantagens mais significativas da ativação de réplicas na memória é o aumento do QPS (consulta por segundo) e da taxa de transferência globais. Além disso, podem ser mantidas várias réplicas de segmentos e o sistema é mais resiliente face a uma falha.</p>
<h2 id="Enable-in-memory-replicas-in-the-Milvus-vector-database" class="common-anchor-header">Ativar as réplicas na memória na base de dados vetorial Milvus<button data-href="#Enable-in-memory-replicas-in-the-Milvus-vector-database" class="anchor-icon" translate="no">
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
    </button></h2><p>A ativação da nova funcionalidade de réplicas na memória é simples na base de dados vetorial Milvus. Basta especificar o número de réplicas que pretende ao carregar uma coleção (ou seja, ao chamar <code translate="no">collection.load()</code>).</p>
<p>No exemplo de tutorial que se segue, supomos que já <a href="https://milvus.io/docs/v2.1.x/create_collection.md">criou uma coleção</a> com o nome "book" e <a href="https://milvus.io/docs/v2.1.x/insert_data.md">inseriu dados</a> na mesma. Em seguida, pode executar o seguinte comando para criar duas réplicas ao <a href="https://milvus.io/docs/v2.1.x/load_collection.md">carregar</a> uma coleção de livros.</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> Collection
collection = Collection(<span class="hljs-string">&quot;book&quot;</span>)      <span class="hljs-comment"># Get an existing collection.</span>
collection.load(replica_number=<span class="hljs-number">2</span>) <span class="hljs-comment"># load collection as 2 replicas</span>
<button class="copy-code-btn"></button></code></pre>
<p>Pode modificar de forma flexível o número de réplicas no código de exemplo acima para melhor se adequar ao cenário da sua aplicação. Em seguida, pode efetuar diretamente uma <a href="https://milvus.io/docs/v2.1.x/search.md">pesquisa</a> ou <a href="https://milvus.io/docs/v2.1.x/query.md">consulta</a> de semelhança de vectores em várias réplicas sem executar quaisquer comandos adicionais. No entanto, deve ser observado que o número máximo de réplicas permitido é limitado pela quantidade total de memória utilizável para executar os nós de consulta. Se o número de réplicas que especificar exceder os limites da memória utilizável, será devolvido um erro durante o carregamento de dados.</p>
<p>Também pode verificar as informações das réplicas na memória que criou, executando <code translate="no">collection.get_replicas()</code>. Serão devolvidas as informações dos grupos de réplicas e os nós de consulta e fragmentos correspondentes. A seguir, um exemplo da saída.</p>
<pre><code translate="no">Replica <span class="hljs-built_in">groups</span>:
- Group: &lt;group_id:435309823872729305&gt;, &lt;group_nodes:(21, 20)&gt;, &lt;shards:[Shard: &lt;channel_name:milvus-zong-rootcoord-dml_27_435367661874184193v0&gt;, &lt;shard_leader:21&gt;, &lt;shard_nodes:[21]&gt;, Shard: &lt;channel_name:milvus-zong-rootcoord-dml_28_435367661874184193v1&gt;, &lt;shard_leader:20&gt;, &lt;shard_nodes:[20, 21]&gt;]&gt;
- Group: &lt;group_id:435309823872729304&gt;, &lt;group_nodes:(25,)&gt;, &lt;shards:[Shard: &lt;channel_name:milvus-zong-rootcoord-dml_28_435367661874184193v1&gt;, &lt;shard_leader:25&gt;, &lt;shard_nodes:[25]&gt;, Shard: &lt;channel_name:milvus-zong-rootcoord-dml_27_435367661874184193v0&gt;, &lt;shard_leader:25&gt;, &lt;shard_nodes:[25]&gt;]&gt;
<button class="copy-code-btn"></button></code></pre>
<h2 id="Whats-next" class="common-anchor-header">O que vem a seguir<button data-href="#Whats-next" class="anchor-icon" translate="no">
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
    </button></h2><p>Com o lançamento oficial do Milvus 2.1, preparámos uma série de blogues que apresentam as novas funcionalidades. Leia mais nesta série de blogues:</p>
<ul>
<li><a href="https://milvus.io/blog/2022-08-08-How-to-use-string-data-to-empower-your-similarity-search-applications.md">Como utilizar dados de cadeias de caracteres para potenciar as suas aplicações de pesquisa por semelhança</a></li>
<li><a href="https://milvus.io/blog/embedded-milvus.md">Usando o Embedded Milvus para instalar e executar instantaneamente o Milvus com Python</a></li>
<li><a href="https://milvus.io/blog/in-memory-replicas.md">Aumente a taxa de transferência de leitura do seu banco de dados vetorial com réplicas na memória</a></li>
<li><a href="https://milvus.io/blog/understanding-consistency-levels-in-the-milvus-vector-database.md">Entendendo o nível de consistência no banco de dados vetorial do Milvus</a></li>
<li><a href="https://milvus.io/blog/understanding-consistency-levels-in-the-milvus-vector-database-2.md">Entendendo o nível de consistência no banco de dados vetorial do Milvus (Parte II)</a></li>
<li><a href="https://milvus.io/blog/data-security.md">Como o banco de dados vetorial do Milvus garante a segurança dos dados?</a></li>
</ul>
