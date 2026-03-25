---
id: data-addressing-storage-systems.md
title: >-
  Um mergulho profundo no endereçamento de dados em sistemas de armazenamento:
  Do HashMap ao HDFS, Kafka, Milvus e Iceberg
author: Bill Chen
date: 2026-3-25
cover: >-
  assets.zilliz.com/cover_A_Deep_Dive_into_Data_Addressing_in_Storage_Systems_6b436abeae.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: >-
  data addressing, distributed storage architecture, Milvus storage design,
  vector database internals, Apache Iceberg
meta_title: |
  Data Addressing Deep Dive: From HashMap to Milvus
desc: >-
  Veja como o endereçamento de dados funciona do HashMap ao HDFS, Kafka, Milvus
  e Iceberg - e por que os locais de computação superam a pesquisa em todas as
  escalas.
origin: 'https://milvus.io/blog/data-addressing-storage-systems.md'
---
<p>Se trabalha em sistemas de backend ou armazenamento distribuído, provavelmente já viu isto: a rede não está saturada, as máquinas não estão sobrecarregadas, mas uma simples pesquisa desencadeia milhares de E/S de disco ou chamadas à API de armazenamento de objectos - e a consulta continua a demorar segundos.</p>
<p>O estrangulamento raramente é a largura de banda ou a computação. É o <em>endereçamento</em> - o trabalho que um sistema faz para descobrir onde estão os dados antes de os poder ler. <strong>O endereçamento de dados</strong> é o processo de tradução de um identificador lógico (uma chave, um caminho de ficheiro, um offset, um predicado de consulta) para a localização física dos dados no armazenamento. À escala, este processo - e não a transferência efectiva de dados - domina a latência.</p>
<p>O desempenho do armazenamento pode ser reduzido a um modelo simples:</p>
<blockquote>
<p><strong>Custo total de endereçamento = acessos a metadados + acessos a dados</strong></p>
</blockquote>
<p>Quase todas as optimizações de armazenamento - desde as tabelas de hash às camadas de metadados lakehouse - visam esta equação. As técnicas variam, mas o objetivo é sempre o mesmo: localizar dados com o menor número possível de operações de alta latência.</p>
<p>Este artigo traça essa ideia em sistemas de escala crescente - desde estruturas de dados na memória como o HashMap, a sistemas distribuídos como o HDFS e o Apache Kafka e, finalmente, a motores modernos como o <a href="https://milvus.io/">Milvus</a> (uma <a href="https://zilliz.com/learn/what-is-a-vector-database">base de dados vetorial</a>) e o Apache Iceberg que operam em armazenamento de objectos. Apesar das suas diferenças, todos eles optimizam a mesma equação.</p>
<h2 id="Three-Core-Addressing-Techniques" class="common-anchor-header">Três técnicas principais de endereçamento<button data-href="#Three-Core-Addressing-Techniques" class="anchor-icon" translate="no">
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
    </button></h2><p>Em todos os sistemas de armazenamento e mecanismos distribuídos, a maioria das otimizações de endereçamento se enquadra em três técnicas:</p>
<ul>
<li><strong>Computação</strong> - Derivar a localização dos dados diretamente de uma fórmula, em vez de procurar ou percorrer estruturas para os encontrar.</li>
<li>Armazenamento<strong>em cache</strong> - Manter metadados ou índices frequentemente acedidos na memória para evitar leituras repetidas de alta latência a partir do disco ou do armazenamento remoto.</li>
<li><strong>Poda</strong> - Utilizar informações de intervalo ou limites de partição para excluir ficheiros, fragmentos ou nós que não podem conter o resultado.</li>
</ul>
<p>Ao longo deste artigo, um <em>acesso</em> significa qualquer operação com um custo real ao nível do sistema: uma leitura de disco, uma chamada de rede ou um pedido de API de armazenamento de objectos. A computação da CPU em nível de nanossegundos não conta. O que importa é reduzir o número de operações de E/S - ou transformar E/S aleatórias caras em leituras sequenciais mais baratas.</p>
<h2 id="How-Addressing-Works-The-Two-Sum-Problem" class="common-anchor-header">Como funciona o endereçamento: O problema das duas somas<button data-href="#How-Addressing-Works-The-Two-Sum-Problem" class="anchor-icon" translate="no">
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
    </button></h2><p>Para tornar o endereçamento concreto, considere um problema clássico de algoritmo. Dada uma matriz de números inteiros <code translate="no">nums</code> e um valor de destino <code translate="no">target</code>, devolva os índices de dois números que somam <code translate="no">target</code>.</p>
<p>Por exemplo: <code translate="no">nums = [2, 7, 11, 15]</code>, <code translate="no">target = 9</code> → resultado <code translate="no">[0, 1]</code>.</p>
<p>Este problema ilustra de forma clara a diferença entre procurar dados e calcular onde eles se encontram.</p>
<h3 id="Solution-1-Brute-Force-Search" class="common-anchor-header">Solução 1: Pesquisa de força bruta</h3><p>A abordagem de força bruta verifica cada par. Para cada elemento, ele varre o resto do array procurando por uma correspondência. Simples, mas O(n²).</p>
<pre><code translate="no" class="language-java"><span class="hljs-function"><span class="hljs-keyword">public</span> <span class="hljs-built_in">int</span>[] <span class="hljs-title">twoSum</span>(<span class="hljs-params"><span class="hljs-built_in">int</span>[] nums, <span class="hljs-built_in">int</span> target</span>)</span> {
    <span class="hljs-keyword">for</span> (<span class="hljs-built_in">int</span> i = <span class="hljs-number">0</span>; i &lt; nums.length; i++) {
        <span class="hljs-keyword">for</span> (<span class="hljs-built_in">int</span> j = i + <span class="hljs-number">1</span>; j &lt; nums.length; j++) {
            <span class="hljs-keyword">if</span> (nums[i] + nums[j] == target) <span class="hljs-keyword">return</span> <span class="hljs-keyword">new</span> <span class="hljs-built_in">int</span>[]{i, j};
        }
    }
    <span class="hljs-keyword">return</span> <span class="hljs-literal">null</span>;
}
<button class="copy-code-btn"></button></code></pre>
<p>Não há noção de onde a resposta pode estar. Cada pesquisa começa do zero e percorre o array às cegas. O gargalo não é a aritmética - é a varredura repetida.</p>
<h3 id="Solution-2-Direct-Addressing-via-Computation" class="common-anchor-header">Solução 2: Endereçamento direto via computação</h3><p>A solução otimizada substitui a varredura por um HashMap. Em vez de procurar um valor correspondente, calcula o valor necessário e procura-o diretamente. A complexidade de tempo cai para O(n).</p>
<pre><code translate="no" class="language-java">public <span class="hljs-type">int</span>[] twoSum(<span class="hljs-type">int</span>[] nums, <span class="hljs-type">int</span> target) {
    Map&lt;Integer, Integer&gt; <span class="hljs-keyword">map</span> = <span class="hljs-built_in">new</span> HashMap&lt;&gt;();
    <span class="hljs-keyword">for</span> (<span class="hljs-type">int</span> i = <span class="hljs-number">0</span>; i &lt; nums.length; i++) {
        <span class="hljs-type">int</span> complement = target - nums[i]; <span class="hljs-comment">// compute what we need</span>
        <span class="hljs-keyword">if</span> (<span class="hljs-keyword">map</span>.containsKey(complement)) { <span class="hljs-comment">// direct lookup, no scan</span>
            <span class="hljs-keyword">return</span> <span class="hljs-built_in">new</span> <span class="hljs-type">int</span>[]{<span class="hljs-keyword">map</span>.get(complement), i};
        }
        <span class="hljs-keyword">map</span>.put(nums[i], i);
    }
    <span class="hljs-keyword">return</span> null;
}
<button class="copy-code-btn"></button></code></pre>
<p>A mudança: em vez de percorrer a matriz para encontrar uma correspondência, calcula-se o que é necessário e vai-se diretamente à sua localização. Quando a localização pode ser obtida, a travessia desaparece.</p>
<p>Esta é a mesma ideia por detrás de todos os sistemas de armazenamento de elevado desempenho que iremos examinar: substituir as pesquisas por computação e os caminhos de pesquisa indirectos por endereçamento direto.</p>
<h2 id="HashMap-How-Computed-Addresses-Replace-Scans" class="common-anchor-header">HashMap: Como os endereços computados substituem as varreduras<button data-href="#HashMap-How-Computed-Addresses-Replace-Scans" class="anchor-icon" translate="no">
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
    </button></h2><p>Um HashMap armazena pares chave-valor e localiza os valores calculando um endereço a partir da chave - não pesquisando nas entradas. Dada uma chave, aplica uma função hash, calcula um índice de matriz e salta diretamente para essa localização. Não é necessário procurar.</p>
<p>Esta é a forma mais simples do princípio que orienta todos os sistemas deste artigo: evitar pesquisas derivando localizações através de computação. A mesma ideia - que está na base de tudo, desde pesquisas de metadados distribuídos a <a href="https://zilliz.com/learn/vector-index">índices vectoriais</a> - aparece em todas as escalas.</p>
<h3 id="The-Core-Data-Structure" class="common-anchor-header">A estrutura de dados principal</h3><p>No seu núcleo, um HashMap é construído em torno de uma única estrutura: um array. Uma função hash mapeia chaves para índices de array. Como o espaço da chave é muito maior que o do array, as colisões são inevitáveis - diferentes chaves podem ser hash para o mesmo índice. Estas são tratadas localmente dentro de cada slot usando uma lista ligada ou uma árvore vermelha e preta.</p>
<p>As matrizes permitem o acesso em tempo constante por índice. Esta propriedade - endereçamento direto e previsível - é a base do desempenho do HashMap e o mesmo princípio que está na base do acesso eficiente aos dados em sistemas de armazenamento de grande escala.</p>
<pre><code translate="no" class="language-java"><span class="hljs-keyword">public</span> <span class="hljs-keyword">class</span> <span class="hljs-title class_">HashMap</span>&lt;K,V&gt; {

    <span class="hljs-comment">// Core structure: an array that supports O(1) random access</span>
    <span class="hljs-keyword">transient</span> Node&lt;K,V&gt;[] table;

    <span class="hljs-comment">// Node structure</span>
    <span class="hljs-keyword">static</span> <span class="hljs-keyword">class</span> <span class="hljs-title class_">Node</span>&lt;K,V&gt; {
        <span class="hljs-keyword">final</span> <span class="hljs-type">int</span> hash;      <span class="hljs-comment">// hash value (cached to avoid recomputation)</span>
        <span class="hljs-keyword">final</span> K key;         <span class="hljs-comment">// key</span>
        V value;             <span class="hljs-comment">// value</span>
        Node&lt;K,V&gt; next;      <span class="hljs-comment">// next node (for handling collision)</span>
    }

    <span class="hljs-comment">// Hash function：key → integer</span>
    <span class="hljs-keyword">static</span> <span class="hljs-keyword">final</span> <span class="hljs-type">int</span> <span class="hljs-title function_">hash</span><span class="hljs-params">(Object key)</span> {
        <span class="hljs-type">int</span> h;
        <span class="hljs-keyword">return</span> (key == <span class="hljs-literal">null</span>) ? <span class="hljs-number">0</span> : (h = key.hashCode()) ^ (h &gt;&gt;&gt; <span class="hljs-number">16</span>);
    }
}
<button class="copy-code-btn"></button></code></pre>
<h3 id="How-Does-a-HashMap-Locate-Data" class="common-anchor-header">Como um HashMap localiza os dados?</h3><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/data_addressing_storage_systems_2_4ada70fe33.png" alt="Step-by-step HashMap addressing: hash the key, compute the array index, jump directly to the bucket, and resolve locally — achieving O(1) lookup without traversal" class="doc-image" id="step-by-step-hashmap-addressing:-hash-the-key,-compute-the-array-index,-jump-directly-to-the-bucket,-and-resolve-locally-—-achieving-o(1)-lookup-without-traversal" />
   </span> <span class="img-wrapper"> <span>Endereçamento passo-a-passo do HashMap: fazer o hash da chave, computar o índice do array, saltar diretamente para o bucket e resolver localmente - obtendo uma pesquisa O(1) sem travessia</span> </span></p>
<p>Veja <code translate="no">put(&quot;apple&quot;, 100)</code> como exemplo. A pesquisa completa leva quatro passos - sem varrimento da tabela completa:</p>
<ol>
<li><strong>Fazer o hash da chave:</strong> Passar a chave por uma função de hash → <code translate="no">hash(&quot;apple&quot;) = 93029210</code></li>
<li><strong>Mapear para um índice de matriz:</strong> <code translate="no">93029210 &amp; (arrayLength - 1)</code> → e.g., <code translate="no">93029210 &amp; 15 = 10</code></li>
<li><strong>Saltar para o balde:</strong> Aceder diretamente a <code translate="no">table[10]</code> - um único acesso à memória, não uma travessia</li>
<li><strong>Resolver localmente:</strong> Se não houver colisão, ler ou escrever imediatamente. Se houver uma colisão, verificar uma pequena lista ligada ou uma árvore vermelha e preta dentro desse balde.</li>
</ol>
<h3 id="Why-Is-HashMap-Lookup-O1" class="common-anchor-header">Porque é que a pesquisa no HashMap é O(1)?</h3><p>O acesso a matrizes é O(1) devido a uma fórmula de endereçamento simples:</p>
<pre><code translate="no">element_address = base_address + index × element_size
<button class="copy-code-btn"></button></code></pre>
<p>Dado um índice, o endereço de memória é calculado com uma multiplicação e uma adição. O custo é fixo, independentemente do tamanho da matriz - um cálculo, uma leitura de memória. Uma lista ligada, pelo contrário, tem de ser percorrida nó a nó, seguindo os apontadores através de localizações de memória separadas: O(n) no pior dos casos.</p>
<p>Um HashMap transforma uma chave num índice de matriz, transformando o que seria uma travessia num endereço computado. Em vez de procurar dados, calcula exatamente onde os dados se encontram e salta para lá.</p>
<h2 id="How-Does-Addressing-Change-in-Distributed-Systems" class="common-anchor-header">Como o endereçamento muda em sistemas distribuídos?<button data-href="#How-Does-Addressing-Change-in-Distributed-Systems" class="anchor-icon" translate="no">
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
    </button></h2><p>O HashMap resolve o endereçamento dentro de uma única máquina, onde os dados residem na memória e os custos de acesso são triviais. Em escalas maiores, as restrições mudam drasticamente:</p>
<table>
<thead>
<tr><th>Fator de escala</th><th>Impacto</th></tr>
</thead>
<tbody>
<tr><td>Tamanho dos dados</td><td>Megabytes → terabytes ou petabytes em clusters</td></tr>
<tr><td>Meio de armazenamento</td><td>Memória → disco → rede → armazenamento de objectos</td></tr>
<tr><td>Latência de acesso</td><td>Memória: ~100 ns / Disco: 10-20 ms / Rede Same-DC: ~0,5 ms / Entre regiões: ~150 ms</td></tr>
</tbody>
</table>
<p>O problema de endereçamento não muda - apenas fica mais caro. Cada pesquisa pode envolver saltos de rede e E/S de disco, pelo que a redução do número de acessos é muito mais importante do que na memória.</p>
<p>Para ver como os sistemas reais lidam com isso, veremos dois exemplos clássicos. O HDFS aplica o endereçamento baseado em computação a ficheiros grandes e baseados em blocos. O Kafka aplica-o a fluxos de mensagens apenas anexados. Ambos seguem o mesmo princípio: computar onde estão os dados em vez de procurá-los.</p>
<h2 id="HDFS-Addressing-Large-Files-with-In-Memory-Metadata" class="common-anchor-header">HDFS: endereçando arquivos grandes com metadados na memória<button data-href="#HDFS-Addressing-Large-Files-with-In-Memory-Metadata" class="anchor-icon" translate="no">
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
    </button></h2><p>O HDFS é um sistema <a href="https://milvus.io/docs/architecture_overview.md">de armazenamento distribuído</a> concebido para ficheiros muito grandes em clusters de máquinas. Dado um caminho de arquivo e um deslocamento de bytes, ele precisa encontrar o bloco de dados correto e o DataNode que o armazena.</p>
<p>O HDFS resolve isso com uma escolha de design deliberada: manter todos os metadados do sistema de arquivos na memória.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/data_addressing_storage_systems_1_26ff6257b1.png" alt="HDFS data organization showing logical view of a 300MB file mapped to physical storage as three blocks distributed across DataNodes with replication" class="doc-image" id="hdfs-data-organization-showing-logical-view-of-a-300mb-file-mapped-to-physical-storage-as-three-blocks-distributed-across-datanodes-with-replication" />
   </span> <span class="img-wrapper"> <span>Organização de dados do HDFS mostrando a visão lógica de um arquivo de 300MB mapeado para o armazenamento físico como três blocos distribuídos entre DataNodes com replicação</span> </span></p>
<p>No centro está o NameNode. Ele carrega toda a árvore do sistema de arquivos - estrutura de diretório, mapeamentos de arquivo para bloco e mapeamentos de bloco para DataNode - na memória. Como os metadados nunca entram em contacto com o disco durante as leituras, o HDFS resolve todas as questões de endereçamento apenas através de pesquisas na memória.</p>
<p>Conceptualmente, isto é o HashMap à escala do cluster: utilizar estruturas de dados na memória para transformar pesquisas lentas em pesquisas rápidas e computadas. A diferença é que o HDFS aplica o mesmo princípio a conjuntos de dados espalhados por milhares de máquinas.</p>
<pre><code translate="no" class="language-java"><span class="hljs-comment">// Data structures stored in the NameNode&#x27;s memory</span>

<span class="hljs-comment">// 1. Filesystem directory tree</span>
<span class="hljs-keyword">class</span> <span class="hljs-title class_">FSDirectory</span> {
    INodeDirectory rootDir;           <span class="hljs-comment">// root directory &quot;/&quot;</span>
    INodeMap inodeMap;                <span class="hljs-comment">// path → INode (HashMap!)</span>
}

<span class="hljs-comment">// 2. INode：file / directory node</span>
<span class="hljs-keyword">abstract</span> <span class="hljs-keyword">class</span> <span class="hljs-title class_">INode</span> {
    <span class="hljs-type">long</span> id;                          <span class="hljs-comment">// unique identifier</span>
    String name;                      <span class="hljs-comment">// name</span>
    INode parent;                     <span class="hljs-comment">// parent node</span>
    <span class="hljs-type">long</span> modificationTime;            <span class="hljs-comment">// last modification time</span>
}

<span class="hljs-keyword">class</span> <span class="hljs-title class_">INodeFile</span> <span class="hljs-keyword">extends</span> <span class="hljs-title class_">INode</span> {
    BlockInfo[] blocks;               <span class="hljs-comment">// list of blocks that make up the file</span>
}

<span class="hljs-comment">// 3. Block metadata mapping</span>
<span class="hljs-keyword">class</span> <span class="hljs-title class_">BlocksMap</span> {
    GSet&lt;Block, BlockInfo&gt; blocks;    <span class="hljs-comment">// Block → location info (HashMap!)</span>
}

<span class="hljs-keyword">class</span> <span class="hljs-title class_">BlockInfo</span> {
    <span class="hljs-type">long</span> blockId;
    DatanodeDescriptor[] storages;    <span class="hljs-comment">// list of DataNodes storing this block</span>
}
<button class="copy-code-btn"></button></code></pre>
<h3 id="How-Does-HDFS-Locate-Data" class="common-anchor-header">Como o HDFS localiza os dados?</h3><p>Considere a leitura de dados no deslocamento de 200 MB de <code translate="no">/user/data/bigfile.txt</code>, com um tamanho de bloco padrão de 128 MB:</p>
<ol>
<li>O cliente envia um único RPC para o NameNode</li>
<li>O NameNode resolve o caminho do arquivo e calcula que o deslocamento de 200 MB cai no segundo bloco (intervalo de 128-256 MB) - inteiramente na memória</li>
<li>O NameNode devolve os DataNodes que armazenam esse bloco (por exemplo, DN2 e DN3)</li>
<li>O cliente lê diretamente do DataNode mais próximo (DN2)</li>
</ol>
<p>Custo total: uma RPC, algumas pesquisas na memória, uma leitura de dados. Os metadados nunca chegam ao disco durante esse processo, e cada pesquisa é feita em tempo constante. O HDFS evita varreduras caras de metadados, mesmo quando os dados são escalonados em grandes clusters.</p>
<h2 id="Apache-Kafka-How-Sparse-Indexing-Avoids-Random-IO" class="common-anchor-header">Apache Kafka: Como a indexação esparsa evita a E/S aleatória<button data-href="#Apache-Kafka-How-Sparse-Indexing-Avoids-Random-IO" class="anchor-icon" translate="no">
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
    </button></h2><p>O Apache Kafka foi projetado para fluxos de mensagens de alto rendimento. Dado um deslocamento de mensagem, ele precisa localizar a posição exata do byte no disco - sem transformar as leituras em E/S aleatórias.</p>
<p>O Kafka combina o armazenamento sequencial com um índice esparso na memória. Em vez de procurar nos dados, ele calcula uma localização aproximada e executa uma varredura pequena e limitada.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/data_addressing_storage_systems_4_6af2d2cf97.png" alt="Kafka data organization showing logical view with topics and partitions mapped to physical storage as partition directories containing .log, .index, and .timeindex segment files" class="doc-image" id="kafka-data-organization-showing-logical-view-with-topics-and-partitions-mapped-to-physical-storage-as-partition-directories-containing-.log,-.index,-and-.timeindex-segment-files" />
   </span> <span class="img-wrapper"> <span>A organização de dados do Kafka mostra uma visão lógica com tópicos e partições mapeados para o armazenamento físico como diretórios de partição contendo arquivos de segmento .log, .index e .timeindex</span> </span></p>
<p>As mensagens são organizadas como Tópico → Partição → Segmento. Cada partição é um log append-only dividido em segmentos, cada um consistindo de:</p>
<ul>
<li>Um ficheiro <code translate="no">.log</code> que armazena as mensagens sequencialmente no disco</li>
<li>Um ficheiro <code translate="no">.index</code> que funciona como um índice esparso no registo</li>
</ul>
<p>O ficheiro <code translate="no">.index</code> é mapeado na memória (mmap), pelo que as pesquisas de índice são efectuadas diretamente a partir da memória sem E/S do disco.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/data_addressing_storage_systems_3_0e4e99b226.png" alt="Kafka sparse index design showing one index entry per 4KB of data, with memory comparison: dense index at 800MB versus sparse index at just 2MB resident in memory" class="doc-image" id="kafka-sparse-index-design-showing-one-index-entry-per-4kb-of-data,-with-memory-comparison:-dense-index-at-800mb-versus-sparse-index-at-just-2mb-resident-in-memory" />
   </span> <span class="img-wrapper"> <span>Design do índice esparso do Kafka mostrando uma entrada de índice por 4 KB de dados, com comparação de memória: índice denso de 800 MB versus índice esparso de apenas 2 MB residente na memória</span> </span></p>
<pre><code translate="no" class="language-java"><span class="hljs-comment">// A Partition manages all its Segments</span>
<span class="hljs-keyword">class</span> <span class="hljs-title class_">LocalLog</span> {
    <span class="hljs-comment">// Core structure: TreeMap, ordered by baseOffset</span>
    ConcurrentNavigableMap&lt;Long, LogSegment&gt; segments;

    <span class="hljs-comment">// Locate the target Segment</span>
    LogSegment <span class="hljs-title function_">floorEntry</span><span class="hljs-params">(<span class="hljs-type">long</span> offset)</span> {
        <span class="hljs-keyword">return</span> segments.floorEntry(offset);  <span class="hljs-comment">// O(log N)</span>
    }
}

<span class="hljs-comment">// A single Segment</span>
<span class="hljs-keyword">class</span> <span class="hljs-title class_">LogSegment</span> {
    FileRecords log;           <span class="hljs-comment">// .log file (message data)</span>
    LazyIndex&lt;OffsetIndex&gt; offsetIndex;  <span class="hljs-comment">// .index file (sparse index)</span>
    <span class="hljs-type">long</span> baseOffset;           <span class="hljs-comment">// starting Offset</span>
}

<span class="hljs-comment">// Sparse index entry (8 bytes per entry)</span>
<span class="hljs-keyword">class</span> <span class="hljs-title class_">OffsetPosition</span> {
    <span class="hljs-type">int</span> relativeOffset;        <span class="hljs-comment">// offset relative to baseOffset (4 bytes)</span>
    <span class="hljs-type">int</span> position;              <span class="hljs-comment">// physical position in the .log file (4 bytes)</span>
}
<button class="copy-code-btn"></button></code></pre>
<h3 id="How-Does-Kafka-Locate-Data" class="common-anchor-header">Como é que o Kafka localiza os dados?</h3><p>Suponha que um consumidor leia a mensagem no deslocamento 500.000. O Kafka resolve isso em três etapas:</p>
<p><strong>1. Localizar o segmento</strong> (pesquisa no TreeMap)</p>
<ul>
<li>Offsets de base do segmento: <code translate="no">[0, 367834, 735668, 1103502]</code></li>
<li><code translate="no">floorEntry(500000)</code> → <code translate="no">baseOffset = 367834</code></li>
<li>Ficheiro de destino: <code translate="no">00000000000000367834.log</code></li>
<li>Complexidade de tempo: O(log S), onde S é o número de segmentos (tipicamente &lt; 100)</li>
</ul>
<p><strong>2. Procurar a posição no índice esparso</strong> (.index)</p>
<ul>
<li>Deslocamento relativo: <code translate="no">500000 − 367834 = 132166</code></li>
<li>Pesquisa binária em <code translate="no">.index</code>: encontrar a maior entrada ≤ 132166 → <code translate="no">[132100 → position 20500000]</code></li>
<li>Complexidade temporal: O(log N), onde N é o número de entradas do índice</li>
</ul>
<p><strong>3. Leitura sequencial do registo</strong> (.log)</p>
<ul>
<li>Iniciar a leitura a partir da posição 20.500.000</li>
<li>Continuar até atingir a posição 500.000</li>
<li>É lido, no máximo, um intervalo de índice (~4 KB)</li>
</ul>
<p>Total: uma pesquisa de segmento na memória, uma pesquisa de índice, uma leitura sequencial curta. Nenhum acesso aleatório ao disco.</p>
<h2 id="HDFS-vs-Apache-Kafka" class="common-anchor-header">HDFS vs. Apache Kafka<button data-href="#HDFS-vs-Apache-Kafka" class="anchor-icon" translate="no">
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
    </button></h2><table>
<thead>
<tr><th>Dimensão</th><th>HDFS</th><th>Kafka</th></tr>
</thead>
<tbody>
<tr><td>Objetivo de conceção</td><td>Armazenamento e leitura eficientes de ficheiros maciços</td><td>Leitura/escrita sequencial de alto débito de fluxos de mensagens</td></tr>
<tr><td>Modelo de endereçamento</td><td>Caminho → bloco → DataNode através de HashMaps na memória</td><td>Offset → segmento → posição através de índice esparso + varrimento sequencial</td></tr>
<tr><td>Armazenamento de metadados</td><td>Centralizado na memória do NameNode</td><td>Ficheiros locais, mapeados na memória via mmap</td></tr>
<tr><td>Custo de acesso por pesquisa</td><td>1 RPC + N leituras de blocos</td><td>1 pesquisa de índice + 1 leitura de dados</td></tr>
<tr><td>Otimização chave</td><td>Todos os metadados em memória - nenhum disco no caminho de pesquisa</td><td>Indexação esparsa + layout sequencial evita E/S aleatórias</td></tr>
</tbody>
</table>
<h2 id="Why-Object-Storage-Changes-the-Addressing-Problem" class="common-anchor-header">Porque é que o armazenamento de objectos altera o problema do endereçamento<button data-href="#Why-Object-Storage-Changes-the-Addressing-Problem" class="anchor-icon" translate="no">
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
    </button></h2><p>Do HashMap ao HDFS e ao Kafka, vimos o endereçamento na memória e no armazenamento distribuído clássico. À medida que as cargas de trabalho evoluem, os requisitos continuam aumentando:</p>
<ul>
<li><strong>Consultas mais ricas.</strong> Os sistemas modernos lidam com filtros de vários campos, <a href="https://zilliz.com/glossary/similarity-search">pesquisa de similaridade</a> e predicados complexos - não apenas chaves e deslocamentos simples.</li>
<li><strong>Armazenamento de objectos como padrão.</strong> Os dados vivem cada vez mais em armazenamentos compatíveis com o S3. Os ficheiros estão espalhados por buckets e cada acesso é uma chamada à API com uma latência fixa da ordem das dezenas de milissegundos - mesmo para alguns kilobytes.</li>
</ul>
<p>Neste ponto, a latência - e não a largura de banda - é o gargalo. Uma única solicitação GET do S3 custa ~50 ms, independentemente da quantidade de dados que retorna. Se uma consulta aciona milhares de solicitações desse tipo, a latência total aumenta muito. Minimizar o fan-out da API torna-se a restrição central do projeto.</p>
<p>Vamos analisar dois sistemas modernos - <a href="https://milvus.io/">o Milvus</a>, uma <a href="https://zilliz.com/learn/what-is-a-vector-database">base de dados vetorial</a>, e o Apache Iceberg, um formato de tabela lakehouse - para ver como enfrentam estes desafios. Apesar das suas diferenças, ambos aplicam as mesmas ideias centrais: minimizar os acessos de alta latência, reduzir o fan-out antecipadamente e favorecer a computação em vez da travessia.</p>
<h2 id="Milvus-V1-When-Field-Level-Storage-Creates-Too-Many-Files" class="common-anchor-header">Milvus V1: Quando o armazenamento em nível de campo cria muitos arquivos<button data-href="#Milvus-V1-When-Field-Level-Storage-Creates-Too-Many-Files" class="anchor-icon" translate="no">
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
    </button></h2><p>O Milvus é uma base de dados vetorial amplamente utilizada, concebida para a <a href="https://zilliz.com/glossary/similarity-search">pesquisa de semelhanças</a> em <a href="https://zilliz.com/glossary/vector-embeddings">embeddings vectoriais</a>. A sua conceção inicial de armazenamento reflecte uma primeira abordagem comum à construção do armazenamento de objectos: armazenar cada campo separadamente.</p>
<p>Na V1, cada campo de uma <a href="https://milvus.io/docs/manage-collections.md">coleção</a> é armazenado em ficheiros binlog separados por <a href="https://milvus.io/docs/glossary.md">segmentos</a>.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/data_addressing_storage_systems_5_08cf1c8ec1.png" alt="Milvus V1 storage layout showing a collection split into segments, with each segment storing fields like id, vector, and scalar data in separate binlog files, plus separate stats_log files for file statistics" class="doc-image" id="milvus-v1-storage-layout-showing-a-collection-split-into-segments,-with-each-segment-storing-fields-like-id,-vector,-and-scalar-data-in-separate-binlog-files,-plus-separate-stats_log-files-for-file-statistics" />
   </span> <span class="img-wrapper"> <span>Layout de armazenamento do Milvus V1 mostrando uma coleção dividida em segmentos, com cada segmento armazenando campos como id, vetor, e dados escalares em arquivos binlog separados, além de arquivos stats_log separados para estatísticas de arquivos</span> </span></p>
<h3 id="How-Does-Milvus-V1-Locate-Data" class="common-anchor-header">Como o Milvus V1 localiza os dados?</h3><p>Considere uma consulta simples: <code translate="no">SELECT id, vector FROM collection WHERE id = 123</code>.</p>
<ol>
<li><strong>Pesquisa de metadados</strong> - Consulta etcd/MySQL para a lista de segmentos → <code translate="no">[Segment 12345, 12346, 12347, …]</code></li>
<li><strong>Ler o campo id nos segmentos</strong> - Para cada segmento, ler os ficheiros binlog id</li>
<li>Localizar<strong>a linha de destino</strong> - Pesquisar os dados de id carregados para encontrar <code translate="no">id = 123</code></li>
<li><strong>Ler o campo vetor</strong> - Ler os ficheiros binlog vectoriais correspondentes para o segmento correspondente</li>
</ol>
<p>Total de acessos a ficheiros: <strong>N × (F₁ + F₂ + ...)</strong> onde N = número de segmentos, F = ficheiros binlog por campo.</p>
<p>A matemática fica feia rapidamente. Para uma coleção com 100 campos, 1.000 segmentos e 5 arquivos binlog por campo:</p>
<blockquote>
<p><strong>1.000 × 100 × 5 = 500.000 ficheiros</strong></p>
</blockquote>
<p>Mesmo que uma consulta toque em apenas três campos, são 15.000 chamadas à API de armazenamento de objetos. A 50 ms por pedido S3, a latência serializada atinge <strong>750 segundos</strong> - mais de 12 minutos para uma única consulta.</p>
<h2 id="Milvus-V2-How-Segment-Level-Parquet-Cuts-API-Calls-by-10x" class="common-anchor-header">Milvus V2: Como o parquet de nível de segmento reduz as chamadas à API em 10 vezes<button data-href="#Milvus-V2-How-Segment-Level-Parquet-Cuts-API-Calls-by-10x" class="anchor-icon" translate="no">
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
    </button></h2><p>Para corrigir os limites de escalabilidade da V1, o Milvus V2 faz uma mudança fundamental: organiza os dados por <a href="https://milvus.io/docs/glossary.md">segmento</a> em vez de por campo. Em vez de muitos pequenos ficheiros binlog, a V2 consolida os dados em ficheiros Parquet baseados em segmentos.</p>
<p>A contagem de ficheiros cai de <code translate="no">N × fields × binlogs</code> para aproximadamente <code translate="no">N</code> (um grupo de ficheiros por segmento).</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/data_addressing_storage_systems_7_95db65a6e0.png" alt="Milvus V2 storage layout showing a segment stored as Parquet files with row groups containing column chunks for id, vector, and timestamp, plus a footer with schema and column statistics" class="doc-image" id="milvus-v2-storage-layout-showing-a-segment-stored-as-parquet-files-with-row-groups-containing-column-chunks-for-id,-vector,-and-timestamp,-plus-a-footer-with-schema-and-column-statistics" />
   </span> <span class="img-wrapper"> <span>Layout de armazenamento do Milvus V2 mostrando um segmento armazenado como arquivos Parquet com grupos de linhas contendo pedaços de colunas para id, vetor e timestamp, além de um rodapé com esquema e estatísticas de coluna</span> </span></p>
<p>Mas o V2 não armazena todos os campos num único ficheiro. Ele agrupa os campos por tamanho:</p>
<ul>
<li><strong>Pequenos <a href="https://milvus.io/docs/scalar_index.md">campos escalares</a></strong> (como id, timestamp) são armazenados juntos</li>
<li><strong>Os campos grandes</strong> (como <a href="https://zilliz.com/learn/sparse-and-dense-embeddings">vectores densos</a>) são divididos em ficheiros dedicados</li>
</ul>
<p>Todos os ficheiros pertencem ao mesmo segmento e as linhas são alinhadas por índice entre ficheiros.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/data_addressing_storage_systems_9_fe4f57a1e0.png" alt="Parquet file structure showing row groups with column chunks and compressed data pages, plus a footer containing file metadata, row group metadata, and column statistics like min/max values" class="doc-image" id="parquet-file-structure-showing-row-groups-with-column-chunks-and-compressed-data-pages,-plus-a-footer-containing-file-metadata,-row-group-metadata,-and-column-statistics-like-min/max-values" />
   </span> <span class="img-wrapper"> <span>A estrutura do ficheiro Parquet mostra grupos de linhas com pedaços de colunas e páginas de dados comprimidos, além de um rodapé que contém metadados do ficheiro, metadados do grupo de linhas e estatísticas das colunas, como valores mínimos/máximos</span> </span></p>
<h3 id="How-Does-Milvus-V2-Locate-Data" class="common-anchor-header">Como é que o Milvus V2 localiza os dados?</h3><p>Para a mesma consulta - <code translate="no">SELECT id, vector FROM collection WHERE id = 123</code>:</p>
<ol>
<li>Procura de<strong>metadados</strong> - Obtém a lista de segmentos → <code translate="no">[12345, 12346, …]</code></li>
<li><strong>Ler os rodapés do Parquet</strong> - Extrair estatísticas do grupo de linhas. Verifique o mínimo/máximo da coluna id por grupo de linhas. <code translate="no">id = 123</code> cai no Grupo de linhas 0 (min=1, max=1000).</li>
<li><strong>Ler apenas o que é necessário</strong> - A poda de colunas do Parquet lê apenas a coluna id do ficheiro de campo pequeno e apenas a coluna <a href="https://milvus.io/docs/index-vector-fields.md">vetor</a> do ficheiro de campo grande. Apenas os grupos de linhas correspondentes são acedidos.</li>
</ol>
<p>A divisão de campos grandes oferece dois benefícios principais:</p>
<ul>
<li><strong>Leituras mais eficientes.</strong> <a href="https://zilliz.com/glossary/vector-embeddings">Os embeddings vetoriais</a> dominam o tamanho do armazenamento. Misturados com campos pequenos, eles limitam quantas linhas cabem em um grupo de linhas, aumentando os acessos ao arquivo. Isolá-los permite que grupos de linhas de campos pequenos contenham muito mais linhas, enquanto campos grandes usam layouts otimizados para seu tamanho.</li>
<li><strong>Evolução flexível <a href="https://milvus.io/docs/schema.md">do esquema</a>.</strong> Adicionar uma coluna significa criar um novo ficheiro. Remover uma significa ignorá-la no momento da leitura. Não é necessário reescrever dados históricos.</li>
</ul>
<p>Resultado: o número de ficheiros diminui mais de 10 vezes, as chamadas à API diminuem mais de 10 vezes e a latência das consultas diminui de minutos para segundos.</p>
<h2 id="Milvus-V1-vs-V2" class="common-anchor-header">Milvus V1 vs. V2<button data-href="#Milvus-V1-vs-V2" class="anchor-icon" translate="no">
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
    </button></h2><table>
<thead>
<tr><th>Aspeto</th><th>V1</th><th>V2</th></tr>
</thead>
<tbody>
<tr><td>Organização de ficheiros</td><td>Dividido por campo</td><td>Integrado por segmento</td></tr>
<tr><td>Ficheiros por coleção</td><td>N × campos × binóculos</td><td>~N × grupos de colunas</td></tr>
<tr><td>Formato de armazenamento</td><td>Binlog personalizado</td><td>Parquet (também suporta Lance e Vortex)</td></tr>
<tr><td>Poda de colunas</td><td>Natural (ficheiros ao nível do campo)</td><td>Poda de colunas Parquet</td></tr>
<tr><td>Estatísticas</td><td>Ficheiros stats_log separados</td><td>Incorporado no rodapé do Parquet</td></tr>
<tr><td>Chamadas à API S3 por consulta</td><td>10,000+</td><td>~1,000</td></tr>
<tr><td>Latência da consulta</td><td>Minutos</td><td>Segundos</td></tr>
</tbody>
</table>
<h2 id="Apache-Iceberg-Metadata-Driven-File-Pruning" class="common-anchor-header">Apache Iceberg: Poda de ficheiros orientada por metadados<button data-href="#Apache-Iceberg-Metadata-Driven-File-Pruning" class="anchor-icon" translate="no">
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
    </button></h2><p>O Apache Iceberg gere tabelas analíticas sobre conjuntos de dados maciços em sistemas de lakehouse. Quando uma tabela abrange milhares de ficheiros de dados, o desafio é restringir uma consulta apenas aos ficheiros relevantes - sem analisar tudo.</p>
<p>A resposta do Iceberg: decidir quais os ficheiros a ler <em>antes de</em> ocorrer qualquer E/S de dados, utilizando metadados em camadas. Este é o mesmo princípio subjacente à <a href="https://zilliz.com/learn/metadata-filtering-with-milvus">filtragem de metadados</a> em bases de dados vectoriais - utilizar estatísticas pré-computadas para ignorar dados irrelevantes.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/data_addressing_storage_systems_8_a9b063bdbe.png" alt="Iceberg data organization showing a metadata directory with metadata.json, manifest lists, and manifest files alongside a data directory with date-partitioned Parquet files" class="doc-image" id="iceberg-data-organization-showing-a-metadata-directory-with-metadata.json,-manifest-lists,-and-manifest-files-alongside-a-data-directory-with-date-partitioned-parquet-files" />
   </span> <span class="img-wrapper"> <span>Organização de dados do Iceberg mostrando um diretório de metadados com metadata.json, listas de manifesto e ficheiros de manifesto ao lado de um diretório de dados com ficheiros Parquet particionados por data</span> </span></p>
<p>O Iceberg usa uma estrutura de metadados em camadas. Cada camada filtra os dados irrelevantes antes de a seguinte ser consultada - semelhante à forma como <a href="https://milvus.io/docs/architecture_overview.md">as bases de dados distribuídas</a> separam os metadados dos dados para um acesso eficiente.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/data_addressing_storage_systems_6_afc159ea22.png" alt="Iceberg four-layer architecture: metadata.json points to manifest lists, which reference manifest files containing file-level statistics, which point to actual Parquet data files" class="doc-image" id="iceberg-four-layer-architecture:-metadata.json-points-to-manifest-lists,-which-reference-manifest-files-containing-file-level-statistics,-which-point-to-actual-parquet-data-files" />
   </span> <span class="img-wrapper"> <span>A arquitetura de quatro camadas do Iceberg: metadata.json aponta para listas de manifestos, que fazem referência a ficheiros de manifestos que contêm estatísticas ao nível dos ficheiros, que apontam para os ficheiros de dados Parquet reais</span> </span></p>
<h3 id="How-Does-Iceberg-Locate-Data" class="common-anchor-header">Como é que o Iceberg localiza os dados?</h3><p>Considere: <code translate="no">SELECT * FROM orders WHERE date='2024-01-15' AND amount&gt;1000</code>.</p>
<ol>
<li><strong>Ler metadata.json</strong> (1 I/O) - Carregar o snapshot atual e as suas listas de manifesto</li>
<li><strong>Ler a lista de manifestos</strong> (1 E/S) - Aplicar filtros <a href="https://milvus.io/docs/use-partition-key.md">a nível de partição</a> para ignorar partições inteiras (por exemplo, todos os dados de 2023 são eliminados)</li>
<li><strong>Ler ficheiros de manifesto</strong> (2 E/S) - Utilizar estatísticas ao nível do ficheiro (data mín/máx, quantidade mín/máx) para eliminar ficheiros que não correspondem à consulta</li>
<li><strong>Ler ficheiros de dados</strong> (3 E/S) - Apenas três ficheiros permanecem e são realmente lidos</li>
</ol>
<p>Em vez de pesquisar todos os 1000 ficheiros de dados, o Iceberg completa a pesquisa em <strong>7 operações de E/S</strong> - evitando mais de 94% de leituras desnecessárias.</p>
<h2 id="How-Different-Systems-Address-Data" class="common-anchor-header">Como os diferentes sistemas tratam os dados<button data-href="#How-Different-Systems-Address-Data" class="anchor-icon" translate="no">
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
    </button></h2><table>
<thead>
<tr><th>Sistema</th><th>Organização dos dados</th><th>Mecanismo de endereçamento principal</th><th>Custo de acesso</th></tr>
</thead>
<tbody>
<tr><td>HashMap</td><td>Chave → ranhura da matriz</td><td>Função de hash → índice direto</td><td>Acesso à memória O(1)</td></tr>
<tr><td>HDFS</td><td>Caminho → bloco → DataNode</td><td>HashMaps na memória + cálculo do bloco</td><td>1 RPC + N leituras de blocos</td></tr>
<tr><td>Kafka</td><td>Tópico → Partição → Segmento</td><td>TreeMap + índice esparso + varrimento sequencial</td><td>1 pesquisa de índice + 1 leitura de dados</td></tr>
<tr><td><a href="https://milvus.io/">Milvus</a> V2</td><td><a href="https://milvus.io/docs/manage-collections.md">Coleção</a> → Segmento → Colunas Parquet</td><td>Pesquisa de metadados + poda de colunas</td><td>N leituras (N = segmentos)</td></tr>
<tr><td>Iceberg</td><td>Tabela → Instantâneo → Manifesto → Ficheiros de dados</td><td>Metadados em camadas + poda estatística</td><td>3 leituras de metadados + M leituras de dados</td></tr>
</tbody>
</table>
<h2 id="Three-Principles-Behind-Efficient-Data-Addressing" class="common-anchor-header">Três princípios por trás do endereçamento eficiente de dados<button data-href="#Three-Principles-Behind-Efficient-Data-Addressing" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="1-Computation-Always-Beats-Search" class="common-anchor-header">1. A computação sempre supera a busca</h3><p>Em todos os sistemas que examinámos, a otimização mais eficaz segue a mesma regra: calcular onde estão os dados em vez de os procurar.</p>
<ul>
<li>O HashMap calcula um índice de array a partir de <code translate="no">hash(key)</code> em vez de procurar</li>
<li>O HDFS calcula o bloco de destino a partir de um offset de ficheiro em vez de percorrer os metadados do sistema de ficheiros</li>
<li>O Kafka calcula o segmento relevante e a posição do índice em vez de procurar no registo</li>
<li>O Iceberg utiliza predicados e estatísticas ao nível do ficheiro para calcular os ficheiros que vale a pena ler</li>
</ul>
<p>A computação é aritmética com um custo fixo. A pesquisa é uma travessia - comparações, perseguição de ponteiros ou E/S - e o seu custo aumenta com o tamanho dos dados. Quando um sistema pode derivar uma localização diretamente, a pesquisa torna-se desnecessária.</p>
<h3 id="2-Minimize-High-Latency-Accesses" class="common-anchor-header">2. Minimizar acessos de alta latência</h3><p>Isso nos leva de volta à fórmula principal: <strong>Custo total de endereçamento = acessos a metadados + acessos a dados.</strong> Cada otimização visa, em última análise, reduzir estas operações de alta latência.</p>
<table>
<thead>
<tr><th>Padrão</th><th>Exemplo</th></tr>
</thead>
<tbody>
<tr><td>Reduzir a contagem de ficheiros para limitar o fan-out da API</td><td>Consolidação do segmento Milvus V2</td></tr>
<tr><td>Usar estatísticas para excluir dados antecipadamente</td><td>Poda do manifesto Iceberg</td></tr>
<tr><td>Metadados de cache na memória</td><td>NameNode do HDFS, índices de mmap do Kafka</td></tr>
<tr><td>Trocar pequenas pesquisas sequenciais por menos leituras aleatórias</td><td>Índice esparso do Kafka</td></tr>
</tbody>
</table>
<h3 id="3-Statistics-Enable-Early-Decisions" class="common-anchor-header">3. As estatísticas permitem decisões antecipadas</h3><p>O registo de informações simples em tempo de escrita - valores mínimos/máximos, limites de partição, contagens de linhas - permite que os sistemas decidam em tempo de leitura quais os ficheiros que valem a pena ler e quais podem ser totalmente ignorados.</p>
<p>Este é um pequeno investimento com um grande retorno. As estatísticas transformam o acesso aos ficheiros de uma leitura cega numa escolha deliberada. Quer se trate da poda ao nível do manifesto do Iceberg ou das estatísticas de rodapé do Parquet do Milvus V2, o princípio é o mesmo: alguns bytes de metadados no momento da escrita podem eliminar milhares de operações de E/S no momento da leitura.</p>
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
    </button></h2><p>Do Two Sum ao HashMap, e do HDFS e Kafka ao Milvus e Apache Iceberg, um padrão se repete: o desempenho depende da eficiência com que um sistema localiza os dados.</p>
<p>À medida que os dados crescem e o armazenamento passa da memória para o disco e para o armazenamento de objectos, a mecânica muda - mas as ideias centrais não. Os melhores sistemas calculam localizações em vez de procurarem, mantêm os metadados próximos e utilizam estatísticas para evitar tocar em dados que não interessam. Todos os ganhos de desempenho que examinámos provêm da redução dos acessos de alta latência e do estreitamento do espaço de pesquisa o mais cedo possível.</p>
<p>Quer esteja a conceber um pipeline de <a href="https://zilliz.com/learn/what-is-vector-search">pesquisa vetorial</a>, a criar sistemas sobre <a href="https://zilliz.com/learn/introduction-to-unstructured-data">dados não estruturados</a> ou a otimizar um motor de pesquisa de lakehouse, aplica-se a mesma equação. Compreender como o seu sistema aborda os dados é o primeiro passo para o tornar mais rápido.</p>
<hr>
<p>Se estiver a trabalhar com o Milvus e quiser otimizar o desempenho do seu armazenamento ou consulta, gostaríamos de o ajudar:</p>
<ul>
<li>Junte-se à <a href="https://slack.milvus.io/">comunidade Milvus Slack</a> para fazer perguntas, partilhar a sua arquitetura e aprender com outros engenheiros que trabalham em problemas semelhantes.</li>
<li><a href="https://milvus.io/office-hours">Reserve uma sessão gratuita de 20 minutos do Milvus Office Hours</a> para analisar o seu caso de utilização - quer se trate da disposição do armazenamento, da afinação de consultas ou do escalonamento para produção.</li>
<li>Se preferir ignorar a configuração da infraestrutura, <a href="https://cloud.zilliz.com/signup">o Zilliz Cloud</a> (Milvus gerido) oferece um nível gratuito para começar.</li>
</ul>
<hr>
<p>Algumas perguntas que surgem quando os engenheiros começam a pensar no endereçamento de dados e no design do armazenamento:</p>
<p><strong>P: Porque é que o Milvus mudou do armazenamento ao nível do campo para o armazenamento ao nível do segmento?</strong></p>
<p>No Milvus V1, cada campo era armazenado em ficheiros binlog separados por segmentos. Para uma coleção com 100 campos e 1.000 segmentos, isto criava centenas de milhares de pequenos ficheiros - cada um exigindo a sua própria chamada à API S3. O V2 consolida os dados em arquivos Parquet baseados em segmentos, reduzindo a contagem de arquivos em mais de 10 vezes e diminuindo a latência da consulta de minutos para segundos. A principal conclusão: no armazenamento de objectos, o número de chamadas à API é mais importante do que o volume total de dados.</p>
<p><strong>Q: Como é que o Milvus lida com a pesquisa vetorial e a filtragem escalar de forma eficiente?</strong></p>
<p>Milvus V2 armazena <a href="https://milvus.io/docs/scalar_index.md">campos escalares</a> e <a href="https://milvus.io/docs/index-vector-fields.md">campos vetoriais</a> em grupos de arquivos separados dentro do mesmo segmento. As consultas escalares utilizam a poda de colunas Parquet e estatísticas de grupos de linhas para ignorar dados irrelevantes. <a href="https://zilliz.com/learn/what-is-vector-search">A pesquisa vetorial</a> utiliza <a href="https://zilliz.com/learn/vector-index">índices vectoriais</a> dedicados. Ambas partilham a mesma estrutura de segmento, pelo que <a href="https://zilliz.com/learn/hybrid-search-a-practical-guide">as consultas híbridas</a> - combinando filtros escalares com similaridade vetorial - podem operar nos mesmos dados sem duplicação.</p>
<p><strong>P: O princípio "computação sobre pesquisa" aplica-se a bases de dados vectoriais?</strong></p>
<p>Sim. <a href="https://zilliz.com/learn/vector-index">Os índices vectoriais</a>, como o HNSW e o IVF, baseiam-se na mesma ideia. Em vez de comparar um vetor de consulta com todos os vectores armazenados (pesquisa de força bruta), utilizam estruturas gráficas ou centróides de clusters para calcular vizinhanças aproximadas e saltar diretamente para regiões relevantes do espaço vetorial. A contrapartida - uma pequena perda de precisão para uma ordem de grandeza menor de cálculos de distância - é o mesmo padrão de "cálculo sobre pesquisa" aplicado a dados <a href="https://zilliz.com/glossary/vector-embeddings">de incorporação de</a> alta dimensão.</p>
<p><strong>P: Qual é o maior erro de desempenho que as equipas cometem com o armazenamento de objectos?</strong></p>
<p>Criar demasiados ficheiros pequenos. Cada solicitação GET do S3 tem um piso de latência fixo (~50 ms), independentemente da quantidade de dados que retorna. Um sistema que lê 10.000 pequenos ficheiros serializa 500 segundos de latência - mesmo que o volume total de dados seja modesto. A solução é a consolidação: mesclar arquivos pequenos em arquivos maiores, usar formatos colunares como o Parquet para leituras seletivas e manter metadados que permitam ignorar arquivos completamente.</p>
