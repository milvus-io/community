---
id: 2022-02-07-how-milvus-deletes-streaming-data-in-distributed-cluster.md
title: Utilização
author: Lichen Wang
date: 2022-02-07T00:00:00.000Z
desc: >-
  A conceção fundamental da função de eliminação do Milvus 2.0, a base de dados
  vetorial mais avançada do mundo.
cover: assets.zilliz.com/Delete_9f40bbfa94.png
tag: Engineering
---
<custom-h1>Como o Milvus exclui dados de streaming em um cluster distribuído</custom-h1><p>Com um processamento unificado de batch e stream e uma arquitetura nativa da nuvem, o Milvus 2.0 representa um desafio maior do que o seu antecessor durante o desenvolvimento da função DELETE. Graças ao seu design avançado de desagregação de armazenamento-computação e ao mecanismo flexível de publicação/assinatura, temos o orgulho de anunciar que conseguimos. No Milvus 2.0, é possível apagar uma entidade de uma determinada coleção com a sua chave primária, de modo a que a entidade apagada deixe de ser listada no resultado de uma pesquisa ou consulta.</p>
<p>Note-se que a operação DELETE no Milvus refere-se à eliminação lógica, enquanto que a limpeza física dos dados ocorre durante a Compactação de Dados. A eliminação lógica não só aumenta consideravelmente o desempenho da pesquisa limitada pela velocidade de I/O, mas também facilita a recuperação de dados. Os dados eliminados logicamente podem ainda ser recuperados com a ajuda da função Time Travel.</p>
<h2 id="Usage" class="common-anchor-header">Utilização<button data-href="#Usage" class="anchor-icon" translate="no">
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
    </button></h2><p>Vamos experimentar primeiro a função DELETE no Milvus 2.0. (O exemplo a seguir usa PyMilvus 2.0.0 em Milvus 2.0.0).</p>
<pre><code translate="no" class="language-python"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> connections, utility, Collection, DataType, FieldSchema, CollectionSchema
<span class="hljs-comment"># Connect to Milvus</span>
connections.connect(
    alias=<span class="hljs-string">&quot;default&quot;</span>, 
    host=<span class="hljs-string">&#x27;x.x.x.x&#x27;</span>, 
    port=<span class="hljs-string">&#x27;19530&#x27;</span>
)
<span class="hljs-comment"># Create a collection with Strong Consistency level</span>
pk_field = FieldSchema(
    name=<span class="hljs-string">&quot;id&quot;</span>, 
    dtype=DataType.INT64, 
    is_primary=<span class="hljs-literal">True</span>, 
)
vector_field = FieldSchema(
    name=<span class="hljs-string">&quot;vector&quot;</span>, 
    dtype=DataType.FLOAT_VECTOR, 
    dim=<span class="hljs-number">2</span>
)
schema = CollectionSchema(
    fields=[pk_field, vector_field], 
    description=<span class="hljs-string">&quot;Test delete&quot;</span>
)
collection_name = <span class="hljs-string">&quot;test_delete&quot;</span>
collection = Collection(
    name=collection_name, 
    schema=schema, 
    using=<span class="hljs-string">&#x27;default&#x27;</span>, 
    shards_num=<span class="hljs-number">2</span>,
    consistency_level=<span class="hljs-string">&quot;Strong&quot;</span>
)
<span class="hljs-comment"># Insert randomly generated vectors</span>
<span class="hljs-keyword">import</span> random
data = [
    [i <span class="hljs-keyword">for</span> i <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(<span class="hljs-number">100</span>)],
    [[random.random() <span class="hljs-keyword">for</span> _ <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(<span class="hljs-number">2</span>)] <span class="hljs-keyword">for</span> _ <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(<span class="hljs-number">100</span>)],
]
collection.insert(data)
<span class="hljs-comment"># Query to make sure the entities to delete exist</span>
collection.load()
expr = <span class="hljs-string">&quot;id in [2,4,6,8,10]&quot;</span>
pre_del_res = collection.query(
    expr,
    output_fields = [<span class="hljs-string">&quot;id&quot;</span>, <span class="hljs-string">&quot;vector&quot;</span>]
)
<span class="hljs-built_in">print</span>(pre_del_res)
<span class="hljs-comment"># Delete the entities with the previous expression</span>
collection.delete(expr)
<span class="hljs-comment"># Query again to check if the deleted entities exist</span>
post_del_res = collection.query(
    expr,
    output_fields = [<span class="hljs-string">&quot;id&quot;</span>, <span class="hljs-string">&quot;vector&quot;</span>]
)
<span class="hljs-built_in">print</span>(post_del_res)
<button class="copy-code-btn"></button></code></pre>
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
    </button></h2><p>Em uma instância do Milvus, um nó de dados é responsável principalmente pelo empacotamento de dados de streaming (logs no corretor de logs) como dados históricos (instantâneos de logs) e pela descarga automática deles para o armazenamento de objetos. Um nó de consulta executa pedidos de pesquisa em dados completos, ou seja, tanto dados de fluxo contínuo como dados históricos.</p>
<p>Para tirar o máximo partido da capacidade de escrita de dados dos nós paralelos de um cluster, o Milvus adopta uma estratégia de sharding baseada no hashing de chaves primárias para distribuir uniformemente as operações de escrita pelos diferentes nós de trabalho. Ou seja, o proxy encaminha as mensagens (ou seja, os pedidos) da Linguagem de Manipulação de Dados (DML) de uma entidade para o mesmo nó de dados e nó de consulta. Estas mensagens são publicadas através do canal DML e consumidas pelo nó de dados e pelo nó de consulta separadamente para fornecer serviços de pesquisa e consulta em conjunto.</p>
<h3 id="Data-node" class="common-anchor-header">Nó de dados</h3><p>Depois de receber as mensagens INSERT de dados, o nó de dados insere os dados num segmento crescente, que é um novo segmento criado para receber dados em fluxo contínuo na memória. Se a contagem de linhas de dados ou a duração do segmento crescente atingir o limiar, o nó de dados sela-o para impedir a entrada de quaisquer dados. O nó de dados então libera o segmento selado, que contém os dados históricos, para o armazenamento de objeto. Entretanto, o nó de dados gera um filtro bloom baseado nas chaves primárias dos novos dados e descarrega-o para o armazenamento de objectos juntamente com o segmento selado, guardando o filtro bloom como uma parte do registo binário de estatísticas (binlog), que contém a informação estatística do segmento.</p>
<blockquote>
<p>Um filtro bloom é uma estrutura de dados probabilística que consiste em um vetor binário longo e uma série de funções de mapeamento aleatório. Pode ser utilizado para testar se um elemento é um membro de um conjunto, mas pode devolver falsos positivos.           -- Wikipedia</p>
</blockquote>
<p>Quando as mensagens DELETE de dados chegam, o nó de dados armazena em buffer todos os filtros bloom no fragmento correspondente, e combina-os com as chaves primárias fornecidas nas mensagens para recuperar todos os segmentos (tanto dos crescentes como dos selados) que possivelmente incluem as entidades a eliminar. Tendo identificado os segmentos correspondentes, o nó de dados armazena-os em memória para gerar os binlogs Delta para registar as operações de eliminação e, em seguida, descarrega esses binlogs juntamente com os segmentos de volta para o armazenamento de objectos.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/data_node_2397ad70c3.png" alt="Data Node" class="doc-image" id="data-node" />
   </span> <span class="img-wrapper"> <span>Nó de dados</span> </span></p>
<p>Como um fragmento é atribuído apenas a um canal DML, nós de consulta extras adicionados ao cluster não poderão assinar o canal DML. Para garantir que todos os nós de consulta podem receber as mensagens DELETE, os nós de dados filtram as mensagens DELETE do canal DML e encaminham-nas para o canal Delta para notificar todos os nós de consulta das operações de eliminação.</p>
<h3 id="Query-node" class="common-anchor-header">Nó de consulta</h3><p>Ao carregar uma coleção a partir do armazenamento de objectos, o nó de consulta obtém primeiro o ponto de controlo de cada fragmento, que marca as operações DML desde a última operação de descarga. Com base no ponto de controlo, o nó de consulta carrega todos os segmentos selados juntamente com os seus filtros Delta binlog e bloom. Com todos os dados carregados, o nó de consulta então se inscreve no DML-Channel, Delta-Channel e Query-Channel.</p>
<p>Se mais mensagens INSERT de dados chegarem depois que a coleção for carregada na memória, o nó de consulta primeiro identifica os segmentos crescentes de acordo com as mensagens e atualiza os filtros bloom correspondentes na memória apenas para fins de consulta. Esses filtros bloom dedicados à consulta não serão descarregados para o armazenamento de objectos depois de a consulta estar concluída.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/query_node_a78b1d664f.png" alt="Query Node" class="doc-image" id="query-node" />
   </span> <span class="img-wrapper"> <span>Nó de consulta</span> </span></p>
<p>Tal como referido anteriormente, apenas um determinado número de nós de consulta pode receber mensagens DELETE do canal DML, o que significa que apenas estes podem executar os pedidos DELETE em segmentos crescentes. Para os nós de consulta que subscreveram o canal DML, filtram primeiro as mensagens DELETE nos segmentos crescentes, localizam as entidades fazendo corresponder as chaves primárias fornecidas com os filtros bloom dedicados à consulta dos segmentos crescentes e, em seguida, registam as operações de eliminação nos segmentos correspondentes.</p>
<p>Os nós de consulta que não podem subscrever o canal DML só estão autorizados a processar pedidos de pesquisa ou consulta em segmentos selados porque só podem subscrever o canal Delta e receber as mensagens DELETE encaminhadas pelos nós de dados. Tendo recolhido todas as mensagens DELETE nos segmentos selados do Delta-Channel, os nós de consulta localizam as entidades fazendo corresponder as chaves primárias fornecidas com os filtros bloom dos segmentos selados e, em seguida, registam as operações de eliminação nos segmentos correspondentes.</p>
<p>Eventualmente, numa pesquisa ou consulta, os nós de consulta geram um conjunto de bits com base nos registos de eliminação para omitir as entidades eliminadas e pesquisar entre as entidades restantes de todos os segmentos, independentemente do estado do segmento. Por último, mas não menos importante, o nível de consistência afecta a visibilidade dos dados eliminados. Sob Strong Consistency Level (como mostrado no exemplo de código anterior), as entidades excluídas são imediatamente invisíveis após a exclusão. Enquanto o Nível de consistência limitado é adotado, haverá vários segundos de latência antes de as entidades eliminadas se tornarem invisíveis.</p>
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
<li><a href="https://milvus.io/blog/2022-02-07-how-milvus-deletes-streaming-data-in-distributed-cluster.md">Como o Milvus elimina dados de streaming num cluster distribuído</a></li>
<li><a href="https://milvus.io/blog/2022-2-21-compact.md">Como compactar dados no Milvus?</a></li>
<li><a href="https://milvus.io/blog/2022-02-28-how-milvus-balances-query-load-across-nodes.md">Como o Milvus equilibra a carga de consultas entre os nós?</a></li>
<li><a href="https://milvus.io/blog/2022-2-14-bitset.md">Como o Bitset permite a versatilidade da pesquisa de similaridade de vetores</a></li>
</ul>
