---
id: data-addressing-storage-systems.md
title: 深入了解存储系统中的数据寻址：从 HashMap 到 HDFS、Kafka、Milvus 和 Iceberg
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
desc: 追溯从 HashMap 到 HDFS、Kafka、Milvus 和 Iceberg 的数据寻址工作原理，以及为什么计算位置在各种规模上都胜过搜索。
origin: 'https://milvus.io/blog/data-addressing-storage-systems.md'
---
<p>如果你在后端系统或分布式存储上工作，你可能见过这种情况：网络并没有饱和，机器也没有超载，但一个简单的查询会触发数千次磁盘 I/O 或对象存储 API 调用，而查询仍然需要数秒时间。</p>
<p>瓶颈很少是带宽或计算。瓶颈在于<em>寻址</em>--系统在读取数据之前要先找出数据的位置。<strong>数据寻址</strong>是将逻辑标识符（键、文件路径、偏移量、查询谓词）转换为存储数据物理位置的过程。在大规模情况下，这一过程（而非实际数据传输）主导着延迟。</p>
<p>存储性能可以简化为一个简单的模型：</p>
<blockquote>
<p><strong>总寻址成本 = 元数据访问 + 数据访问</strong></p>
</blockquote>
<p>从哈希表到湖泊元数据层，几乎所有的存储优化都以这个等式为目标。技术各有不同，但目标始终如一：用尽可能少的高延迟操作定位数据。</p>
<p>本文在规模不断扩大的系统中追溯了这一理念--从 HashMap 等内存数据结构，到 HDFS 和 Apache Kafka 等分布式系统，最后到<a href="https://milvus.io/">Milvus</a>（<a href="https://zilliz.com/learn/what-is-a-vector-database">向量数据库</a>）和 Apache Iceberg 等在对象存储上操作的现代引擎。尽管存在差异，但它们都对相同的等式进行了优化。</p>
<h2 id="Three-Core-Addressing-Techniques" class="common-anchor-header">三种核心寻址技术<button data-href="#Three-Core-Addressing-Techniques" class="anchor-icon" translate="no">
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
    </button></h2><p>在各种存储系统和分布式引擎中，大多数寻址优化都可归结为三种技术：</p>
<ul>
<li><strong>计算</strong>- 直接从公式中推导出数据的位置，而不是通过扫描或遍历结构来查找数据。</li>
<li><strong>缓存</strong>--将经常访问的元数据或索引保存在内存中，以避免重复从磁盘或远程存储中进行高延迟读取。</li>
<li><strong>剪枝</strong>--使用范围信息或分区边界来排除无法包含结果的文件、碎片或节点。</li>
</ul>
<p>在本文中，<em>访问</em>指的是任何具有实际系统级成本的操作：磁盘读取、网络调用或对象存储 API 请求。纳秒级的 CPU 计算不算在内。重要的是减少 I/O 操作符的数量，或将昂贵的随机 I/O 转换为更便宜的顺序读取。</p>
<h2 id="How-Addressing-Works-The-Two-Sum-Problem" class="common-anchor-header">寻址工作原理：两两相加问题<button data-href="#How-Addressing-Works-The-Two-Sum-Problem" class="anchor-icon" translate="no">
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
    </button></h2><p>为了使寻址具体化，请考虑一个经典的算法问题。给定一个整数数组<code translate="no">nums</code> 和一个目标值<code translate="no">target</code> ，返回相加等于<code translate="no">target</code> 的两个数的索引。</p>
<p>例如<code translate="no">nums = [2, 7, 11, 15]</code>,<code translate="no">target = 9</code> → 结果<code translate="no">[0, 1]</code> 。</p>
<p>这个问题清楚地说明了搜索数据和计算数据位置之间的区别。</p>
<h3 id="Solution-1-Brute-Force-Search" class="common-anchor-header">解决方案 1：暴力搜索</h3><p>暴力搜索法检查每一对元素。对于每个元素，它都会扫描数组的其余部分，寻找匹配的元素。这种方法很简单，但需要 O(n²)。</p>
<pre><code translate="no" class="language-java"><span class="hljs-function"><span class="hljs-keyword">public</span> <span class="hljs-built_in">int</span>[] <span class="hljs-title">twoSum</span>(<span class="hljs-params"><span class="hljs-built_in">int</span>[] nums, <span class="hljs-built_in">int</span> target</span>)</span> {
    <span class="hljs-keyword">for</span> (<span class="hljs-built_in">int</span> i = <span class="hljs-number">0</span>; i &lt; nums.length; i++) {
        <span class="hljs-keyword">for</span> (<span class="hljs-built_in">int</span> j = i + <span class="hljs-number">1</span>; j &lt; nums.length; j++) {
            <span class="hljs-keyword">if</span> (nums[i] + nums[j] == target) <span class="hljs-keyword">return</span> <span class="hljs-keyword">new</span> <span class="hljs-built_in">int</span>[]{i, j};
        }
    }
    <span class="hljs-keyword">return</span> <span class="hljs-literal">null</span>;
}
<button class="copy-code-btn"></button></code></pre>
<p>我们不知道答案可能在哪里。每次查找都从零开始，盲目地遍历数组。瓶颈不是运算，而是重复扫描。</p>
<h3 id="Solution-2-Direct-Addressing-via-Computation" class="common-anchor-header">解决方案 2：通过计算直接寻址</h3><p>优化后的解决方案用 HashMap 代替了扫描。它不是搜索匹配值，而是计算所需值并直接查找。时间复杂度降至 O(n)。</p>
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
<p>转变：不再通过扫描数组来查找匹配值，而是计算所需值并直接查找其位置。一旦可以得出位置，遍历就不复存在了。</p>
<p>这与我们将要研究的所有高性能存储系统的理念相同：用计算代替扫描，用直接寻址代替间接搜索路径。</p>
<h2 id="HashMap-How-Computed-Addresses-Replace-Scans" class="common-anchor-header">哈希图：计算寻址如何取代扫描<button data-href="#HashMap-How-Computed-Addresses-Replace-Scans" class="anchor-icon" translate="no">
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
    </button></h2><p>HashMap 存储键值对，并通过计算键的地址来定位值，而不是通过搜索条目来定位。给定一个键，它会应用哈希函数，计算一个数组索引，然后直接跳转到该位置。无需扫描。</p>
<p>这是本文中所有系统的驱动原则的最简单形式：通过计算得出位置，从而避免扫描。从分布式元数据查找到<a href="https://zilliz.com/learn/vector-index">向量索引</a>，每种规模的系统都采用了相同的理念。</p>
<h3 id="The-Core-Data-Structure" class="common-anchor-header">核心数据结构</h3><p>HashMap 的核心是围绕单一结构构建的：一个数组。散列函数将键映射到数组索引。由于键空间远大于数组空间，碰撞不可避免--不同的键可能会散列到相同的索引。这些问题可以通过链表或红黑树在每个槽中进行本地处理。</p>
<p>数组通过索引提供恒定时间访问。这一特性--直接、可预测的寻址--是 HashMap 性能的基础，也是大规模存储系统中高效数据访问的基本原则。</p>
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
<h3 id="How-Does-a-HashMap-Locate-Data" class="common-anchor-header">HashMap 如何定位数据？</h3><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/data_addressing_storage_systems_2_4ada70fe33.png" alt="Step-by-step HashMap addressing: hash the key, compute the array index, jump directly to the bucket, and resolve locally — achieving O(1) lookup without traversal" class="doc-image" id="step-by-step-hashmap-addressing:-hash-the-key,-compute-the-array-index,-jump-directly-to-the-bucket,-and-resolve-locally-—-achieving-o(1)-lookup-without-traversal" />
   </span> <span class="img-wrapper"> <span>分步式 HashMap 寻址：散列键、计算数组索引、直接跳转到数据桶并在本地解析--无需遍历即可实现 O(1) 查询</span> </span></p>
<p>以<code translate="no">put(&quot;apple&quot;, 100)</code> 为例。整个查找过程只需四个步骤--无需全表扫描：</p>
<ol>
<li><strong>对密钥进行散列：</strong>通过散列函数传递键 → 将键映射到数组索引<code translate="no">hash(&quot;apple&quot;) = 93029210</code></li>
<li><strong>映射到数组索引：</strong> <code translate="no">93029210 &amp; (arrayLength - 1)</code> → 例如<code translate="no">93029210 &amp; 15 = 10</code></li>
<li><strong>跳转到存储桶：</strong>直接访问<code translate="no">table[10]</code> - 单次内存访问，而不是遍历</li>
<li><strong>本地解决：</strong>如果没有碰撞，立即读取或写入。如果有碰撞，则检查该数据桶内的小型链表或红黑树。</li>
</ol>
<h3 id="Why-Is-HashMap-Lookup-O1" class="common-anchor-header">为什么 HashMap 查找是 O(1)？</h3><p>数组访问之所以是 O(1)，是因为有一个简单的寻址公式：</p>
<pre><code translate="no">element_address = base_address + index × element_size
<button class="copy-code-btn"></button></code></pre>
<p>给定一个索引，通过一次乘法和一次加法计算出内存地址。无论数组大小如何，成本都是固定的--一次计算，一次内存读取。相比之下，链表必须一个节点一个节点地遍历，按照指针穿过不同的内存位置：最坏情况下为 O(n)。</p>
<p>HashMap 将键散列到数组索引中，将遍历变成了计算地址。它不用搜索数据，而是准确计算出数据的位置，然后跳转到那里。</p>
<h2 id="How-Does-Addressing-Change-in-Distributed-Systems" class="common-anchor-header">分布式系统中的寻址方式有何变化？<button data-href="#How-Does-Addressing-Change-in-Distributed-Systems" class="anchor-icon" translate="no">
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
    </button></h2><p>HashMap 解决的是单机内的寻址问题，在单机内，数据存在内存中，访问成本微不足道。在更大的范围内，限制因素会发生显著变化：</p>
<table>
<thead>
<tr><th>规模因子</th><th>影响</th></tr>
</thead>
<tbody>
<tr><td>数据大小</td><td>兆字节 → TB 或 PB 跨集群</td></tr>
<tr><td>存储介质</td><td>内存 → 磁盘 → 网络 → 对象存储</td></tr>
<tr><td>访问延迟</td><td>内存~100 ns / 磁盘：10-20 ms / 同直流网络：~0.5 ms / 跨区域：~150 毫秒</td></tr>
</tbody>
</table>
<p>寻址问题并没有改变，只是成本变得更高。每次查找都可能涉及网络跳转和磁盘 I/O，因此减少访问次数的重要性远远超过内存。</p>
<p>为了了解实际系统是如何处理这个问题的，我们来看两个经典例子。HDFS 将基于计算的寻址应用于基于块的大型文件。Kafka 则将其应用于仅有追加的消息流。两者遵循相同的原则：计算数据在哪里，而不是搜索数据。</p>
<h2 id="HDFS-Addressing-Large-Files-with-In-Memory-Metadata" class="common-anchor-header">HDFS：使用内存元数据寻址大型文件<button data-href="#HDFS-Addressing-Large-Files-with-In-Memory-Metadata" class="anchor-icon" translate="no">
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
    </button></h2><p>HDFS 是一种<a href="https://milvus.io/docs/architecture_overview.md">分布式存储系统</a>，专为跨机器集群的超大文件而设计。在给定文件路径和字节偏移量的情况下，它需要找到正确的数据块和存储该数据块的数据节点。</p>
<p>HDFS 在设计上特意选择了将所有文件系统元数据保存在内存中，从而解决了这一问题。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/data_addressing_storage_systems_1_26ff6257b1.png" alt="HDFS data organization showing logical view of a 300MB file mapped to physical storage as three blocks distributed across DataNodes with replication" class="doc-image" id="hdfs-data-organization-showing-logical-view-of-a-300mb-file-mapped-to-physical-storage-as-three-blocks-distributed-across-datanodes-with-replication" />
   </span> <span class="img-wrapper"> <span>HDFS 数据组织显示了一个 300MB 文件的逻辑视图，该文件以三个数据块的形式映射到物理存储中，并通过复制分布在各个数据节点上</span> </span></p>
<p>位于中心的是 NameNode。它将整个文件系统树（目录结构、文件到数据块映射以及数据块到数据节点映射）加载到内存中。由于元数据在读取过程中从不接触磁盘，因此 HDFS 只通过内存查找来解决所有寻址问题。</p>
<p>从概念上讲，这就是集群规模的 HashMap：使用内存数据结构将慢速搜索转化为快速计算查找。不同的是，HDFS 将相同的原理应用于分布在数千台机器上的数据集。</p>
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
<h3 id="How-Does-HDFS-Locate-Data" class="common-anchor-header">HDFS 如何定位数据？</h3><p>考虑从<code translate="no">/user/data/bigfile.txt</code> 的 200 MB 偏移量读取数据，默认块大小为 128 MB：</p>
<ol>
<li>客户端向 NameNode 发送一个 RPC</li>
<li>NameNode 解析文件路径，并计算出偏移量 200 MB 属于第二个块（128-256 MB 范围）--完全在内存中</li>
<li>名称节点返回存储该数据块的数据节点（如 DN2 和 DN3）</li>
<li>客户端直接从最近的数据节点（DN2）读取数据</li>
</ol>
<p>总成本：一次 RPC、几次内存查询、一次数据读取。在此过程中，元数据永远不会进入磁盘，每次查找都是恒定时间。即使数据在大型集群中扩展，HDFS 也能避免昂贵的元数据扫描。</p>
<h2 id="Apache-Kafka-How-Sparse-Indexing-Avoids-Random-IO" class="common-anchor-header">Apache Kafka：稀疏索引如何避免随机 I/O<button data-href="#Apache-Kafka-How-Sparse-Indexing-Avoids-Random-IO" class="anchor-icon" translate="no">
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
    </button></h2><p>Apache Kafka 专为高吞吐量的消息流而设计。给定一个消息偏移，它需要在磁盘上找到准确的字节位置，而不会将读取变成随机 I/O。</p>
<p>Kafka 将顺序存储与稀疏的内存索引相结合。它不需要在数据中进行搜索，而是计算一个近似位置，然后执行小范围的有界扫描。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/data_addressing_storage_systems_4_6af2d2cf97.png" alt="Kafka data organization showing logical view with topics and partitions mapped to physical storage as partition directories containing .log, .index, and .timeindex segment files" class="doc-image" id="kafka-data-organization-showing-logical-view-with-topics-and-partitions-mapped-to-physical-storage-as-partition-directories-containing-.log,-.index,-and-.timeindex-segment-files" />
   </span> <span class="img-wrapper"> <span>Kafka 数据组织显示逻辑视图，主题和分区映射到物理存储，分区目录包含 .log、.index 和 .timeindex 段文件</span> </span></p>
<p>消息以主题 → 分区 → 片段的方式组织。每个分区都是一个仅有附加文件的日志，被分割成多个分段，每个分段包括</p>
<ul>
<li>在磁盘上按顺序存储信息的<code translate="no">.log</code> 文件</li>
<li>作为日志稀疏索引的<code translate="no">.index</code> 文件</li>
</ul>
<p><code translate="no">.index</code> 文件是内存映射（mmap）的，因此索引查询直接从内存进行，无需磁盘 I/O。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/data_addressing_storage_systems_3_0e4e99b226.png" alt="Kafka sparse index design showing one index entry per 4KB of data, with memory comparison: dense index at 800MB versus sparse index at just 2MB resident in memory" class="doc-image" id="kafka-sparse-index-design-showing-one-index-entry-per-4kb-of-data,-with-memory-comparison:-dense-index-at-800mb-versus-sparse-index-at-just-2mb-resident-in-memory" />
   </span> <span class="img-wrapper"> <span>Kafka 稀疏索引设计显示每 4KB 数据有一个索引条目，内存对比：800MB 的密集索引与仅 2MB 的稀疏索引驻留在内存中</span> </span></p>
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
<h3 id="How-Does-Kafka-Locate-Data" class="common-anchor-header">Kafka 如何定位数据？</h3><p>假设消费者读取了偏移量 500,000 处的消息。Kafka 分三步解决这个问题：</p>
<p><strong>1.定位段</strong>（TreeMap 查找）</p>
<ul>
<li>段基偏移量：<code translate="no">[0, 367834, 735668, 1103502]</code></li>
<li><code translate="no">floorEntry(500000)</code> →<code translate="no">baseOffset = 367834</code></li>
<li>目标文件：<code translate="no">00000000000000367834.log</code></li>
<li>时间复杂度：O（log S），其中 S 是段的数量（通常小于 100）</li>
</ul>
<p><strong>2.在稀疏索引</strong>（.index）<strong>中查找位置</strong></p>
<ul>
<li>相对偏移：<code translate="no">500000 − 367834 = 132166</code></li>
<li>在<code translate="no">.index</code> 中进行二进制搜索：查找最大条目 ≤ 132166 → 3.<code translate="no">[132100 → position 20500000]</code></li>
<li>时间复杂度O(log N)，其中 N 是索引条目数</li>
</ul>
<p><strong>3.顺序读取日志</strong>(.log)</p>
<ul>
<li>从位置 20,500,000 开始读取</li>
<li>一直读到偏移量 500,000</li>
<li>最多扫描一个索引区间（~4 KB）</li>
</ul>
<p>总计：一次内存段查找、一次索引查找、一次短序列读取。无随机磁盘访问。</p>
<h2 id="HDFS-vs-Apache-Kafka" class="common-anchor-header">HDFS 与 Apache Kafka 的比较<button data-href="#HDFS-vs-Apache-Kafka" class="anchor-icon" translate="no">
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
<tr><th>尺寸</th><th>HDFS</th><th>卡夫卡</th></tr>
</thead>
<tbody>
<tr><td>设计目标</td><td>高效存储和读取海量文件</td><td>高吞吐量顺序读/写消息流</td></tr>
<tr><td>寻址模型</td><td>通过内存哈希映射实现路径 → 块 → 数据节点</td><td>通过稀疏索引 + 顺序扫描实现偏移 → 段 → 位置</td></tr>
<tr><td>元数据存储</td><td>集中在 NameNode 内存中</td><td>本地文件，通过 mmap 进行内存映射</td></tr>
<tr><td>每次查询的访问成本</td><td>1 次 RPC + N 次数据块读取</td><td>1 次索引查询 + 1 次数据读取</td></tr>
<tr><td>关键优化</td><td>所有元数据都在内存中 - 查找路径中没有磁盘</td><td>稀疏索引+顺序布局避免了随机 I/O</td></tr>
</tbody>
</table>
<h2 id="Why-Object-Storage-Changes-the-Addressing-Problem" class="common-anchor-header">对象存储为何会改变寻址问题<button data-href="#Why-Object-Storage-Changes-the-Addressing-Problem" class="anchor-icon" translate="no">
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
    </button></h2><p>从 HashMap 到 HDFS 和 Kafka，我们看到了在内存和传统分布式存储中的寻址。随着工作负载的发展，要求也在不断提高：</p>
<ul>
<li><strong>更丰富的查询。</strong>现代系统需要处理多字段过滤器、<a href="https://zilliz.com/glossary/similarity-search">相似性搜索</a>和复杂的谓词，而不仅仅是简单的键和偏移量。</li>
<li><strong>将对象存储作为默认设置。</strong>数据越来越多地保存在兼容 S3 的存储中。文件分散在不同的存储桶中，每次访问都需要调用 API，即使是几千字节的数据，也会出现几十毫秒的固定延迟。</li>
</ul>
<p>此时，延迟而非带宽才是瓶颈所在。无论返回多少数据，单个 S3 GET 请求的成本都在 50 毫秒左右。如果一个查询会触发数千个这样的请求，总延迟就会急剧上升。尽量减少 API 的扇出成为设计的核心限制。</p>
<p>我们将研究两个现代系统--<a href="https://zilliz.com/learn/what-is-a-vector-database">向量数据库</a> <a href="https://milvus.io/">Milvus</a> 和湖泊表格式 Apache Iceberg，看看它们是如何应对这些挑战的。尽管两者有所不同，但它们都采用了相同的核心思想：尽量减少高延迟访问，尽早减少扇出，并使计算优先于遍历。</p>
<h2 id="Milvus-V1-When-Field-Level-Storage-Creates-Too-Many-Files" class="common-anchor-header">Milvus V1：当场级存储产生过多文件时<button data-href="#Milvus-V1-When-Field-Level-Storage-Creates-Too-Many-Files" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 是一种广泛使用的向量数据库，设计用于<a href="https://zilliz.com/glossary/vector-embeddings">向量嵌入的</a> <a href="https://zilliz.com/glossary/similarity-search">相似性搜索</a>。其早期的存储设计反映了建立对象存储的第一种常见方法：单独存储每个字段。</p>
<p>在 V1 中，<a href="https://milvus.io/docs/manage-collections.md">Collection</a>中的每个字段都<a href="https://milvus.io/docs/glossary.md">跨段</a>存储在单独的 binlog 文件中。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/data_addressing_storage_systems_5_08cf1c8ec1.png" alt="Milvus V1 storage layout showing a collection split into segments, with each segment storing fields like id, vector, and scalar data in separate binlog files, plus separate stats_log files for file statistics" class="doc-image" id="milvus-v1-storage-layout-showing-a-collection-split-into-segments,-with-each-segment-storing-fields-like-id,-vector,-and-scalar-data-in-separate-binlog-files,-plus-separate-stats_log-files-for-file-statistics" />
   </span> <span class="img-wrapper"> <span>Milvus V1 的存储布局显示，一个 Collections 被分割成多个分段，每个分段将 id、向量和标量数据等字段存储在单独的 binlog 文件中，另外还有单独的 stats_log 文件用于文件统计</span> </span></p>
<h3 id="How-Does-Milvus-V1-Locate-Data" class="common-anchor-header">Milvus V1 如何定位数据？</h3><p>考虑一个简单的查询：<code translate="no">SELECT id, vector FROM collection WHERE id = 123</code>.</p>
<ol>
<li><strong>元数据查询</strong>- 查询 etcd/MySQL 中的段列表 → 读取各段的 id 字段。<code translate="no">[Segment 12345, 12346, 12347, …]</code></li>
<li><strong>读取各分段的 id 字段</strong>- 对于每个分段，读取 id binlog 文件</li>
<li><strong>定位目标行</strong>- 扫描加载的 id 数据以查找<code translate="no">id = 123</code></li>
<li><strong>读取向量字段</strong>- 为匹配的分段读取相应的向量 binlog 文件</li>
</ol>
<p>文件访问总量：<strong>N × (F₁ + F₂ + ...)</strong>，其中 N = 段数，F = 每个字段的 binlog 文件。</p>
<p>计算结果很快就会变得很难看。对于一个有 100 个字段，1,000 个分段，每个字段有 5 个 binlog 文件的 Collections 而言：</p>
<blockquote>
<p><strong>1,000 × 100 × 5 = 500,000 个文件</strong></p>
</blockquote>
<p>即使查询只涉及三个字段，也需要调用 15,000 次对象存储 API。以每个 S3 请求 50<strong>毫秒</strong>计算，序列化延迟可达<strong>750 秒</strong>，单次查询超过 12 分钟。</p>
<h2 id="Milvus-V2-How-Segment-Level-Parquet-Cuts-API-Calls-by-10x" class="common-anchor-header">Milvus V2：分段级镶块如何将 API 调用减少 10 倍<button data-href="#Milvus-V2-How-Segment-Level-Parquet-Cuts-API-Calls-by-10x" class="anchor-icon" translate="no">
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
    </button></h2><p>为了解决 V1 中的可扩展性限制，Milvus V2 做出了根本性的改变：按<a href="https://milvus.io/docs/glossary.md">段</a>而不是按字<a href="https://milvus.io/docs/glossary.md">段</a>来组织数据。与许多小的 binlog 文件相比，V2 将数据合并到基于段的 Parquet 文件中。</p>
<p>文件数量从<code translate="no">N × fields × binlogs</code> 降至约<code translate="no">N</code> （每个段为一个文件组）。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/data_addressing_storage_systems_7_95db65a6e0.png" alt="Milvus V2 storage layout showing a segment stored as Parquet files with row groups containing column chunks for id, vector, and timestamp, plus a footer with schema and column statistics" class="doc-image" id="milvus-v2-storage-layout-showing-a-segment-stored-as-parquet-files-with-row-groups-containing-column-chunks-for-id,-vector,-and-timestamp,-plus-a-footer-with-schema-and-column-statistics" />
   </span> <span class="img-wrapper"> <span>Milvus V2 存储布局显示以 Parquet 文件存储的段，行组包含 ID、向量和时间戳的列块，以及包含 Schema 和列统计信息的页脚。</span> </span></p>
<p>但 V2 并不将所有字段都存储在单个文件中。它按字段大小分组：</p>
<ul>
<li><strong>小<a href="https://milvus.io/docs/scalar_index.md">标量字段</a></strong>（如 id、时间戳）存储在一起</li>
<li><strong>大字段</strong>（如<a href="https://zilliz.com/learn/sparse-and-dense-embeddings">密集向量</a>）被分割成专用文件</li>
</ul>
<p>所有文件都属于同一分段，行在文件间按索引对齐。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/data_addressing_storage_systems_9_fe4f57a1e0.png" alt="Parquet file structure showing row groups with column chunks and compressed data pages, plus a footer containing file metadata, row group metadata, and column statistics like min/max values" class="doc-image" id="parquet-file-structure-showing-row-groups-with-column-chunks-and-compressed-data-pages,-plus-a-footer-containing-file-metadata,-row-group-metadata,-and-column-statistics-like-min/max-values" />
   </span> <span class="img-wrapper"> <span>Parquet 文件结构显示带有列块和压缩数据页的行组，以及包含文件元数据、行组元数据和列统计信息（如最小值/最大值）的页脚</span> </span></p>
<h3 id="How-Does-Milvus-V2-Locate-Data" class="common-anchor-header">Milvus V2 如何定位数据？</h3><p>对于同一查询 -<code translate="no">SELECT id, vector FROM collection WHERE id = 123</code> ：</p>
<ol>
<li><strong>元数据查询</strong>- 抓取段列表 → 读取 Parquet 页脚<code translate="no">[12345, 12346, …]</code></li>
<li><strong>读取 Parquet 页脚</strong>- 提取行组统计数据。检查每个行组 id 列的最小/最大值。<code translate="no">id = 123</code> 属于第 0 行组（min=1，max=1000）。</li>
<li><strong>只读取需要的内容</strong>- Parquet 的列剪枝只读取小字段文件中的 id 列，只读取大字段文件中的<a href="https://milvus.io/docs/index-vector-fields.md">向量</a>列。只访问匹配的行组。</li>
</ol>
<p>拆分大字段有两个主要好处：</p>
<ul>
<li><strong>读取效率更高。</strong> <a href="https://zilliz.com/glossary/vector-embeddings">向量 Embeddings</a>主导存储大小。与小字段混合后，它们会限制行组中可容纳的行数，从而增加文件访问量。将它们隔离开来，小字段行组可容纳更多的行，而大字段则可使用根据其大小进行优化的布局。</li>
<li><strong>灵活的<a href="https://milvus.io/docs/schema.md">Schema</a>演进。</strong>添加一列意味着创建一个新文件。删除一列意味着在读取时跳过它。无需重写历史数据。</li>
</ul>
<p>结果：文件数量减少了 10 倍以上，API 调用减少了 10 倍以上，查询延迟从几分钟缩短到几秒钟。</p>
<h2 id="Milvus-V1-vs-V2" class="common-anchor-header">Milvus V1 对比 V2<button data-href="#Milvus-V1-vs-V2" class="anchor-icon" translate="no">
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
<tr><th>优势</th><th>V1</th><th>V2</th></tr>
</thead>
<tbody>
<tr><td>文件组织</td><td>按字段分割</td><td>按段整合</td></tr>
<tr><td>每个 Collection 的文件数</td><td>N × 字段 × 二进制日志</td><td>~N × 列组</td></tr>
<tr><td>存储格式</td><td>自定义二进制日志</td><td>Parquet（也支持 Lance 和 Vortex）</td></tr>
<tr><td>列剪枝</td><td>自然（字段级文件）</td><td>Parquet 列剪枝</td></tr>
<tr><td>统计</td><td>单独的 stats_log 文件</td><td>嵌入 Parquet 页脚</td></tr>
<tr><td>每次查询的 S3 API 调用</td><td>10,000+</td><td>~1,000</td></tr>
<tr><td>查询延迟</td><td>分钟</td><td>秒</td></tr>
</tbody>
</table>
<h2 id="Apache-Iceberg-Metadata-Driven-File-Pruning" class="common-anchor-header">阿帕奇冰山元数据驱动的文件剪枝<button data-href="#Apache-Iceberg-Metadata-Driven-File-Pruning" class="anchor-icon" translate="no">
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
    </button></h2><p>Apache Iceberg 管理湖泊系统中海量数据集的分析表。当一个表跨越成千上万个数据文件时，面临的挑战是如何缩小查询范围，只查询相关文件，而不扫描所有文件。</p>
<p>冰山的答案是：使用分层元数据，<em>在</em>任何数据 I/O 发生<em>之前</em>决定读取哪些文件。这与向量数据库<a href="https://zilliz.com/learn/metadata-filtering-with-milvus">中元数据过滤</a>的原理相同--使用预先计算的统计数据跳过无关数据。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/data_addressing_storage_systems_8_a9b063bdbe.png" alt="Iceberg data organization showing a metadata directory with metadata.json, manifest lists, and manifest files alongside a data directory with date-partitioned Parquet files" class="doc-image" id="iceberg-data-organization-showing-a-metadata-directory-with-metadata.json,-manifest-lists,-and-manifest-files-alongside-a-data-directory-with-date-partitioned-parquet-files" />
   </span> <span class="img-wrapper"> <span>Iceberg 数据组织显示了一个包含 metadata.json、清单列表和清单文件的元数据目录，以及一个包含日期分区 Parquet 文件的数据目录。</span> </span></p>
<p>Iceberg 使用分层元数据结构。每一层在查阅下一层之前都会过滤掉不相关的数据--这与<a href="https://milvus.io/docs/architecture_overview.md">分布式数据库</a>为高效访问而将元数据与数据分开的做法类似。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/data_addressing_storage_systems_6_afc159ea22.png" alt="Iceberg four-layer architecture: metadata.json points to manifest lists, which reference manifest files containing file-level statistics, which point to actual Parquet data files" class="doc-image" id="iceberg-four-layer-architecture:-metadata.json-points-to-manifest-lists,-which-reference-manifest-files-containing-file-level-statistics,-which-point-to-actual-parquet-data-files" />
   </span> <span class="img-wrapper"> <span>Iceberg 四层架构：metadata.json 指向清单列表，清单列表引用包含文件级统计数据的清单文件，清单文件指向实际的 Parquet 数据文件。</span> </span></p>
<h3 id="How-Does-Iceberg-Locate-Data" class="common-anchor-header">Iceberg 如何定位数据？</h3><p>请考虑<code translate="no">SELECT * FROM orders WHERE date='2024-01-15' AND amount&gt;1000</code>.</p>
<ol>
<li><strong>读取 metadata.json</strong>(1 I/O) - 加载当前快照及其清单</li>
<li><strong>读取清单</strong>(1 I/O) - 应用<a href="https://milvus.io/docs/use-partition-key.md">分区级</a>过滤器跳过整个分区（例如，消除所有 2023 数据）</li>
<li><strong>读取清单文件</strong>(2 I/O) - 使用文件级统计信息（最小/最大日期、最小/最大数量）来剔除与查询不匹配的文件</li>
<li><strong>读取数据文件</strong>（3 个 I/O）- 仅保留三个文件并实际读取</li>
</ol>
<p>Iceberg 无需扫描全部 1000 个数据文件，只需<strong>7 次 I/O 操作符</strong>即可完成查询 - 避免了 94% 以上的不必要读取。</p>
<h2 id="How-Different-Systems-Address-Data" class="common-anchor-header">不同系统如何处理数据<button data-href="#How-Different-Systems-Address-Data" class="anchor-icon" translate="no">
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
<tr><th>系统</th><th>数据组织</th><th>核心寻址机制</th><th>访问成本</th></tr>
</thead>
<tbody>
<tr><td>哈希图</td><td>键 → 数组槽</td><td>哈希函数 → 直接索引</td><td>O(1) 内存访问</td></tr>
<tr><td>HDFS</td><td>路径 → 块 → 数据节点</td><td>内存哈希映射 + 块计算</td><td>1 个 RPC + N 个块读取</td></tr>
<tr><td>卡夫卡</td><td>主题 → 分区 → 片段</td><td>树形图 + 稀疏索引 + 顺序扫描</td><td>1 次索引查找 + 1 次数据读取</td></tr>
<tr><td><a href="https://milvus.io/">Milvus</a>V2</td><td><a href="https://milvus.io/docs/manage-collections.md">Collections</a>→ Segment → Parquet 列</td><td>元数据查找 + 列剪枝</td><td>N 次读取（N = 段）</td></tr>
<tr><td>冰山</td><td>表→快照→清单→数据文件</td><td>分层元数据 + 统计修剪</td><td>3 次元数据读取 + M 次数据读取</td></tr>
</tbody>
</table>
<h2 id="Three-Principles-Behind-Efficient-Data-Addressing" class="common-anchor-header">高效数据寻址的三大原则<button data-href="#Three-Principles-Behind-Efficient-Data-Addressing" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="1-Computation-Always-Beats-Search" class="common-anchor-header">1.计算永远胜过搜索</h3><p>在我们研究过的每个系统中，最有效的优化都遵循相同的规则：计算数据的位置，而不是搜索数据。</p>
<ul>
<li>HashMap 通过<code translate="no">hash(key)</code> 计算数组索引，而不是扫描</li>
<li>HDFS 通过文件偏移计算目标块，而不是遍历文件系统元数据</li>
<li>Kafka 计算相关段和索引位置，而不是扫描日志</li>
<li>Iceberg 使用谓词和文件级统计来计算哪些文件值得读取</li>
</ul>
<p>计算是有固定成本的算术。搜索是遍历--比较、追指针或 I/O--其成本随数据大小而增长。当系统可以直接得出位置时，扫描就变得没有必要了。</p>
<h3 id="2-Minimize-High-Latency-Accesses" class="common-anchor-header">2.尽量减少高延迟访问</h3><p>这又回到了核心公式：<strong>总寻址成本 = 元数据访问 + 数据访问。</strong>每一次优化最终都是为了减少这些高延迟操作符。</p>
<table>
<thead>
<tr><th>模式</th><th>示例</th></tr>
</thead>
<tbody>
<tr><td>减少文件数量，限制 API 扇出</td><td>Milvus V2 分段合并</td></tr>
<tr><td>使用统计数据提前排除数据</td><td>冰山清单剪枝</td></tr>
<tr><td>在内存中缓存元数据</td><td>HDFS NameNode、Kafka mmap 索引</td></tr>
<tr><td>以较小的顺序扫描换取较少的随机读取</td><td>卡夫卡稀疏索引</td></tr>
</tbody>
</table>
<h3 id="3-Statistics-Enable-Early-Decisions" class="common-anchor-header">3.通过统计数据及早做出决策</h3><p>在写入时记录简单信息--最小/最大值、分区边界、行计数--可让系统在读取时决定哪些文件值得读取，哪些可以完全跳过。</p>
<p>这是一项投资小、回报大的工作。统计数据将文件访问从盲目读取变为深思熟虑的选择。无论是 Iceberg 的清单级剪枝，还是 Milvus V2 的 Parquet 页脚统计，原理都是一样的：在写入时使用几个字节的元数据，就能在读取时省去成千上万次 I/O 操作。</p>
<h2 id="Conclusion" class="common-anchor-header">结论<button data-href="#Conclusion" class="anchor-icon" translate="no">
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
    </button></h2><p>从 Two Sum 到 HashMap，从 HDFS 和 Kafka 到 Milvus 和 Apache Iceberg，有一种模式一直在重复：性能取决于系统定位数据的效率。</p>
<p>随着数据的增长，存储从内存到磁盘再到对象存储，机制会发生变化，但核心思想不会改变。最好的系统会计算位置而不是搜索，保持元数据的紧密性，并使用统计数据来避免接触无关紧要的数据。我们研究过的所有性能优势都来自于减少高延迟访问和尽早缩小搜索空间。</p>
<p>无论您是在设计<a href="https://zilliz.com/learn/what-is-vector-search">向量搜索</a>管道、在<a href="https://zilliz.com/learn/introduction-to-unstructured-data">非结构化数据</a>上构建系统，还是在优化湖泊查询引擎，同样的等式都适用。了解系统如何处理数据，是让系统更快的第一步。</p>
<hr>
<p>如果您正在使用 Milvus，并希望优化存储或查询性能，我们很乐意提供帮助：</p>
<ul>
<li>加入<a href="https://slack.milvus.io/">Milvus Slack 社区</a>，提出问题，分享您的架构，并向解决类似问题的其他工程师学习。</li>
<li><a href="https://milvus.io/office-hours">预约 20 分钟的免费 Milvus Office Hours 会议</a>，了解您的使用案例--无论是存储布局、查询调整还是扩展到生产。</li>
<li>如果您想跳过基础架构设置，<a href="https://cloud.zilliz.com/signup">Zilliz Cloud</a>（托管 Milvus）提供免费层级，让您轻松上手。</li>
</ul>
<hr>
<p>工程师开始考虑数据寻址和存储设计时会遇到的几个问题：</p>
<p><strong>问：Milvus 为什么要从字段级存储转向段级存储？</strong></p>
<p>在 Milvus V1 中，每个字段都存储在跨网段的单独 binlog 文件中。对于一个有 100 个字段和 1,000 个分段的 Collections 而言，这就产生了成千上万个小文件--每个文件都需要自己的 S3 API 调用。V2 将数据整合到基于分段的 Parquet 文件中，将文件数量减少了 10 倍以上，并将查询延迟从几分钟缩短到几秒钟。核心观点：在对象存储中，API 调用次数比数据总量更重要。</p>
<p><strong>问：Milvus 如何高效处理向量搜索和标量过滤？</strong></p>
<p>Milvus V2 将<a href="https://milvus.io/docs/scalar_index.md">标量字段</a>和<a href="https://milvus.io/docs/index-vector-fields.md">向量字段</a>分别存储在同一段内的不同文件组中。标量查询使用 Parquet 列剪枝和行组统计来跳过无关数据。<a href="https://zilliz.com/learn/what-is-vector-search">向量搜索</a>使用专用的<a href="https://zilliz.com/learn/vector-index">向量索引</a>。两者共享相同的段结构，因此<a href="https://zilliz.com/learn/hybrid-search-a-practical-guide">混合查询</a>--结合标量过滤器和向量相似性--可以对相同的数据进行操作，而不会重复。</p>
<p><strong>问："计算重于搜索 "原则是否适用于向量数据库？</strong></p>
<p>适用。像 HNSW 和 IVF 这样的<a href="https://zilliz.com/learn/vector-index">向量索引</a>也是基于同样的理念建立的。它们使用图结构或聚类中心点来计算近似邻域，并直接跳转到向量空间的相关区域，而不是将查询向量与每个存储向量进行比较（暴力搜索）。这样做的代价是，以较小的精度损失换取数量级的距离计算量减少，这与应用于高维<a href="https://zilliz.com/glossary/vector-embeddings">嵌入</a>数据的 "计算重于搜索 "模式如出一辙。</p>
<p><strong>问：团队在使用对象存储时犯的最大性能错误是什么？</strong></p>
<p>创建太多小文件。无论返回多少数据，每个 S3 GET 请求都有一个固定的延迟下限（约 50 毫秒）。一个系统如果读取 10,000 个小文件，即使总数据量不大，也会造成 500 秒的延迟。解决方法是整合：将小文件合并到大文件中，使用 Parquet 等列式格式进行选择性读取，并维护元数据，以便完全跳过文件。</p>
