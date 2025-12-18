---
id: >-
  milvus-ngram-index-faster-keyword-matching-and-like-queries-for-agent-workloads.md
title: Milvus Ngram 索引介绍：针对 Agents 工作负载的更快关键词匹配和 LIKE 查询
author: Chenjie Tang
date: 2025-12-16T00:00:00.000Z
cover: assets.zilliz.com/Ngram_Index_cover_9e6063c638.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Milvus, Ngram Index, n-gram search, LIKE queries, full-text search'
meta_title: >
  Milvus Ngram Index: Faster Keyword Matching and LIKE Queries for Agent
  Workloads
desc: 了解 Milvus 中的 Ngram 索引如何通过将子串匹配转化为高效的 n-gram 查找来加速 LIKE 查询，从而提供快 100 倍的性能。
origin: >-
  https://milvus.io/blog/milvus-ngram-index-faster-keyword-matching-and-like-queries-for-agent-workloads.md
---
<p>在 Agents 系统中，<strong>上下文检索</strong>是整个管道的基础构件，为下游推理、规划和行动提供了基础。向量搜索可以帮助 Agents 检索语义相关的上下文，从而在大型非结构化数据集中捕捉意图和意义。然而，仅有语义相关性往往是不够的。Agents 管道还依赖全文搜索来执行精确的关键字限制，例如产品名称、功能调用、错误代码或具有法律意义的术语。这一支持层可确保检索到的上下文不仅相关，而且明确满足硬性文本要求。</p>
<p>实际工作负载始终反映了这一需求：</p>
<ul>
<li><p>客户支持助理必须找到提及特定产品或成分的对话。</p></li>
<li><p>编码副驾驶员需要查找包含精确函数名、API 调用或错误字符串的片段。</p></li>
<li><p>法律、医疗和学术 Agents 会过滤文档中必须逐字出现的条款或引文。</p></li>
</ul>
<p>传统上，系统都是通过 SQL<code translate="no">LIKE</code> 操作符来处理的。<code translate="no">name LIKE '%rod%'</code> 这样的查询简单，支持范围也很广，但在高并发和大数据量的情况下，这种简单性会带来很大的性能代价。</p>
<ul>
<li><p><strong>如果没有索引</strong>，<code translate="no">LIKE</code> 查询会扫描整个上下文存储，并逐行应用模式匹配。在数百万条记录的情况下，即使是单次查询也需要数秒时间，对于实时代理交互来说，速度实在太慢了。</p></li>
<li><p><strong>即使使用传统的倒排索引</strong>，通配符模式（如<code translate="no">%rod%</code> ）仍然难以优化，因为引擎仍然必须遍历整个字典，并对每个条目进行模式匹配。这种操作符避免了行扫描，但从根本上说仍然是线性的，因此只能带来微不足道的改进。</p></li>
</ul>
<p>这在混合检索系统中造成了明显的差距：向量搜索能有效处理语义相关性，但精确关键词过滤往往成为管道中最慢的步骤。</p>
<p>Milvus 本机支持带元数据过滤的混合向量和全文检索。为了解决关键字匹配的局限性，Milvus 引入了<a href="https://milvus.io/docs/ngram.md"><strong>Ngram 索引</strong></a>，通过将文本拆分成小的子字符串并编制索引以实现高效查找，从而提高了<code translate="no">LIKE</code> 的性能。这大大减少了查询执行过程中检查的数据量，使<code translate="no">LIKE</code> 查询在实际 Agents 工作负载中的<strong>速度提高了数十到数百倍</strong>。</p>
<p>本篇文章的其余部分将介绍 Ngram 索引在 Milvus 中的工作原理，并评估其在实际应用场景中的性能。</p>
<h2 id="What-Is-the-Ngram-Index" class="common-anchor-header">什么是 Ngram 索引？<button data-href="#What-Is-the-Ngram-Index" class="anchor-icon" translate="no">
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
    </button></h2><p>在数据库中，文本过滤通常使用<strong>SQL</strong> 来表达，这是一种用于检索和管理数据的标准查询语言。其最广泛使用的文本操作符之一是<code translate="no">LIKE</code> ，它支持基于模式的字符串匹配。</p>
<p>根据通配符的使用方式，LIKE 表达式可大致分为四种常见的模式类型：</p>
<ul>
<li><p><strong>Infix match</strong>(<code translate="no">name LIKE '%rod%'</code>)：匹配子串 rod 出现在文本中任何位置的记录。</p></li>
<li><p><strong>前缀匹配</strong>(<code translate="no">name LIKE 'rod%'</code>)：匹配文本以 rod 开头的记录。</p></li>
<li><p><strong>后缀匹配</strong>(<code translate="no">name LIKE '%rod'</code>)：匹配文本以 rod 结尾的记录。</p></li>
<li><p><strong>通配符匹配</strong>(<code translate="no">name LIKE '%rod%aab%bc_de'</code>)：将多个子字符串条件 (<code translate="no">%</code>) 与单字符通配符 (<code translate="no">_</code>) 组合在一个模式中。</p></li>
</ul>
<p>虽然这些模式在外观和表现力上各不相同，但 Milvus 中的<strong>Ngram 索引</strong>使用相同的基本方法对所有模式进行了加速。</p>
<p>在建立索引之前，Milvus 会将每个文本值分割成固定长度的重叠短子串，即<em>n-gram</em>。例如，当 n = 3 时，单词<strong>"Milvus "</strong>被分解成以下 3 个词组：<strong>"Mil"、</strong> <strong>"ilv"、"</strong> <strong>lvu "</strong>和<strong>"vus"。</strong>然后将每个 n-gram 保存在一个反向索引中，该索引将子串映射到出现该子串的文档 ID 集。在查询时，<code translate="no">LIKE</code> 条件被转化为 n-gram 查找的组合，从而使 Milvus 能够快速过滤掉大部分不匹配的记录，并根据更小的候选集评估模式。这就是将昂贵的字符串扫描转化为高效的基于索引查询的原因。</p>
<p>有两个参数可以控制 Ngram 索引的构建方式：<code translate="no">min_gram</code> 和<code translate="no">max_gram</code> 。它们共同定义了 Milvus 生成和索引的子串长度范围。</p>
<ul>
<li><p><strong><code translate="no">min_gram</code></strong>:要索引的最短子串长度。在实践中，这也设定了可从 Ngram 索引中获益的最小查询子串长度。</p></li>
<li><p><strong><code translate="no">max_gram</code></strong>:要索引的最长子串长度。在查询时，它还决定了将较长的查询字符串分割成 n-gram 时使用的最大窗口大小。</p></li>
</ul>
<p>通过索引长度在<code translate="no">min_gram</code> 和<code translate="no">max_gram</code> 之间的所有连续子串，Milvus 为加速所有支持的<code translate="no">LIKE</code> 模式类型奠定了一致、高效的基础。</p>
<h2 id="How-Does-the-Ngram-Index-Work" class="common-anchor-header">Ngram 索引如何工作？<button data-href="#How-Does-the-Ngram-Index-Work" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 分两个阶段实现 Ngram 索引：</p>
<ul>
<li><p><strong>建立索引：</strong>为每个文档生成 N-grams，并在数据摄取过程中建立反转索引。</p></li>
<li><p><strong>加速查询：</strong>使用索引将搜索范围缩小到一个小的候选集，然后在这些候选集上验证精确的<code translate="no">LIKE</code> 匹配。</p></li>
</ul>
<p>一个具体的例子可以让我们更容易理解这一过程。</p>
<h3 id="Phase-1-Build-the-index" class="common-anchor-header">第 1 阶段：建立索引</h3><p><strong>将文本分解为 n 个词组：</strong></p>
<p>假设我们用以下设置为文本<strong>"Apple "</strong>建立索引：</p>
<ul>
<li><p><code translate="no">min_gram = 2</code></p></li>
<li><p><code translate="no">max_gram = 3</code></p></li>
</ul>
<p>在此设置下，Milvus 会生成长度为 2 和 3 的所有连续子串：</p>
<ul>
<li><p>2-grams：<code translate="no">Ap</code>,<code translate="no">pp</code>,<code translate="no">pl</code> 、<code translate="no">le</code></p></li>
<li><p>3-grams：<code translate="no">App</code>,<code translate="no">ppl</code> 、<code translate="no">ple</code></p></li>
</ul>
<p><strong>建立倒排索引：</strong></p>
<p>现在考虑一个由五条记录组成的小型数据集：</p>
<ul>
<li><p><strong>文档 0</strong>：<code translate="no">Apple</code></p></li>
<li><p><strong>文档 1</strong>：<code translate="no">Pineapple</code></p></li>
<li><p><strong>文档 2</strong>：<code translate="no">Maple</code></p></li>
<li><p><strong>文档 3</strong>：<code translate="no">Apply</code></p></li>
<li><p><strong>文档 4</strong>：<code translate="no">Snapple</code></p></li>
</ul>
<p>在摄取过程中，Milvus 会为每条记录生成 n 个词组，并将它们插入一个倒排索引。在这个索引中</p>
<ul>
<li><p><strong>键</strong>是 n 字符（子串）</p></li>
<li><p><strong>值</strong>是出现 n-gram 的文档 ID 列表</p></li>
</ul>
<pre><code translate="no"><span class="hljs-string">&quot;Ap&quot;</span>  -&gt; [<span class="hljs-number">0</span>, <span class="hljs-number">3</span>]
<span class="hljs-string">&quot;App&quot;</span> -&gt; [<span class="hljs-number">0</span>, <span class="hljs-number">3</span>]
<span class="hljs-string">&quot;Ma&quot;</span>  -&gt; [<span class="hljs-number">2</span>]
<span class="hljs-string">&quot;Map&quot;</span> -&gt; [<span class="hljs-number">2</span>]
<span class="hljs-string">&quot;Pi&quot;</span>  -&gt; [<span class="hljs-number">1</span>]
<span class="hljs-string">&quot;Pin&quot;</span> -&gt; [<span class="hljs-number">1</span>]
<span class="hljs-string">&quot;Sn&quot;</span>  -&gt; [<span class="hljs-number">4</span>]
<span class="hljs-string">&quot;Sna&quot;</span> -&gt; [<span class="hljs-number">4</span>]
<span class="hljs-string">&quot;ap&quot;</span>  -&gt; [<span class="hljs-number">1</span>, <span class="hljs-number">2</span>, <span class="hljs-number">4</span>]
<span class="hljs-string">&quot;apl&quot;</span> -&gt; [<span class="hljs-number">2</span>]
<span class="hljs-string">&quot;app&quot;</span> -&gt; [<span class="hljs-number">1</span>, <span class="hljs-number">4</span>]
<span class="hljs-string">&quot;ea&quot;</span>  -&gt; [<span class="hljs-number">1</span>]
<span class="hljs-string">&quot;eap&quot;</span> -&gt; [<span class="hljs-number">1</span>]
<span class="hljs-string">&quot;in&quot;</span>  -&gt; [<span class="hljs-number">1</span>]
<span class="hljs-string">&quot;ine&quot;</span> -&gt; [<span class="hljs-number">1</span>]
<span class="hljs-string">&quot;le&quot;</span>  -&gt; [<span class="hljs-number">0</span>, <span class="hljs-number">1</span>, <span class="hljs-number">2</span>, <span class="hljs-number">4</span>]
<span class="hljs-string">&quot;ly&quot;</span>  -&gt; [<span class="hljs-number">3</span>]
<span class="hljs-string">&quot;na&quot;</span>  -&gt; [<span class="hljs-number">4</span>]
<span class="hljs-string">&quot;nap&quot;</span> -&gt; [<span class="hljs-number">4</span>]
<span class="hljs-string">&quot;ne&quot;</span>  -&gt; [<span class="hljs-number">1</span>]
<span class="hljs-string">&quot;nea&quot;</span> -&gt; [<span class="hljs-number">1</span>]
<span class="hljs-string">&quot;pl&quot;</span>  -&gt; [<span class="hljs-number">0</span>, <span class="hljs-number">1</span>, <span class="hljs-number">2</span>, <span class="hljs-number">3</span>, <span class="hljs-number">4</span>]
<span class="hljs-string">&quot;ple&quot;</span> -&gt; [<span class="hljs-number">0</span>, <span class="hljs-number">1</span>, <span class="hljs-number">2</span>, <span class="hljs-number">4</span>]
<span class="hljs-string">&quot;ply&quot;</span> -&gt; [<span class="hljs-number">3</span>]
<span class="hljs-string">&quot;pp&quot;</span>  -&gt; [<span class="hljs-number">0</span>, <span class="hljs-number">1</span>, <span class="hljs-number">3</span>, <span class="hljs-number">4</span>]
<span class="hljs-string">&quot;ppl&quot;</span> -&gt; [<span class="hljs-number">0</span>, <span class="hljs-number">1</span>, <span class="hljs-number">3</span>, <span class="hljs-number">4</span>]
<button class="copy-code-btn"></button></code></pre>
<p>现在，索引已完全建立。</p>
<h3 id="Phase-2-Accelerate-queries" class="common-anchor-header">第二阶段：加速查询</h3><p>当执行<code translate="no">LIKE</code> 过滤器时，Milvus 使用 Ngram 索引通过以下步骤加速查询评估：</p>
<p><strong>1.提取查询词：</strong>从<code translate="no">LIKE</code> 表达式中提取不含通配符的连续子串（例如，<code translate="no">'%apple%'</code> 变成<code translate="no">apple</code> ）。</p>
<p><strong>2.分解查询词：</strong>根据查询词的长度 (<code translate="no">L</code>) 以及配置的<code translate="no">min_gram</code> 和<code translate="no">max_gram</code> ，将查询词分解为 n 个词组。</p>
<p><strong>3.查找每个语法并进行交集：</strong>Milvus 在倒排索引中查找查询的 n 个语法，并与它们的文档 ID 列表进行交集，从而生成一个小的候选集。</p>
<p><strong>4.验证并返回结果：</strong>最初的<code translate="no">LIKE</code> 条件只适用于这个候选集，以确定最终结果。</p>
<p>实际上，将查询分割成 n-gram 的方式取决于模式本身的形状。为了解其工作原理，我们将重点讨论两种常见情况：后缀匹配和通配符匹配。前缀和后缀匹配的行为与后缀匹配相同，因此我们不再单独介绍。</p>
<p><strong>词缀匹配</strong></p>
<p>对于词缀匹配，执行取决于字面子串 (<code translate="no">L</code>) 相对于<code translate="no">min_gram</code> 和<code translate="no">max_gram</code> 的长度。</p>
<p><strong> <code translate="no">min_gram ≤ L ≤ max_gram</code></strong>（如<code translate="no">strField LIKE '%ppl%'</code>)</p>
<p>字面子串<code translate="no">ppl</code> 完全位于配置的 n-gram 范围内。Milvus 直接在倒排索引中查找 n-gram<code translate="no">&quot;ppl&quot;</code> ，生成候选文档 ID<code translate="no">[0, 1, 3, 4]</code> 。</p>
<p>由于字面意思本身就是一个有索引的 n-gram，因此所有候选文档都已满足下位条件。最后的验证步骤不会删除任何记录，结果仍然是<code translate="no">[0, 1, 3, 4]</code> 。</p>
<p><strong>2.<code translate="no">L &gt; max_gram</code></strong>（例如，<code translate="no">strField LIKE '%pple%'</code>)</p>
<p>字面子字符串<code translate="no">pple</code> 比<code translate="no">max_gram</code> 长，因此使用<code translate="no">max_gram</code> 的窗口大小将其分解为重叠的 n 个字符串。加上<code translate="no">max_gram = 3</code> ，就产生了 n 个字符串<code translate="no">&quot;ppl&quot;</code> 和<code translate="no">&quot;ple&quot;</code> 。</p>
<p>Milvus 在倒排索引中查找每个 n-gram：</p>
<ul>
<li><p><code translate="no">&quot;ppl&quot;</code> →<code translate="no">[0, 1, 3, 4]</code></p></li>
<li><p><code translate="no">&quot;ple&quot;</code> →<code translate="no">[0, 1, 2, 4]</code></p></li>
</ul>
<p>将这些列表相交，得到候选集<code translate="no">[0, 1, 4]</code> 。然后，原始的<code translate="no">LIKE '%pple%'</code> 过滤器将应用于这些候选集。三者都满足条件，因此最终结果仍然是<code translate="no">[0, 1, 4]</code> 。</p>
<p><strong>3.<code translate="no">L &lt; min_gram</code></strong>（例如，<code translate="no">strField LIKE '%pp%'</code>)</p>
<p>字面子串短于<code translate="no">min_gram</code> ，因此无法分解为索引 n-gram。在这种情况下，不能使用 Ngram 索引，Milvus 会退回到默认执行路径，通过模式匹配的全扫描来评估<code translate="no">LIKE</code> 条件。</p>
<p><strong>通配符匹配</strong>（如<code translate="no">strField LIKE '%Ap%pple%'</code>)</p>
<p>该模式包含多个通配符，因此 Milvus 首先将其拆分为连续的字面：<code translate="no">&quot;Ap&quot;</code> 和<code translate="no">&quot;pple&quot;</code> 。</p>
<p>然后，Milvus 对每个字面进行独立处理：</p>
<ul>
<li><p><code translate="no">&quot;Ap&quot;</code> 长度为 2，属于 n-gram 范围。</p></li>
<li><p><code translate="no">&quot;pple&quot;</code> 比<code translate="no">max_gram</code> 长，分解为<code translate="no">&quot;ppl&quot;</code> 和<code translate="no">&quot;ple&quot;</code> 。</p></li>
</ul>
<p>这就将查询缩减为以下 n 个词组：</p>
<ul>
<li><p><code translate="no">&quot;Ap&quot;</code> →<code translate="no">[0, 3]</code></p></li>
<li><p><code translate="no">&quot;ppl&quot;</code> →<code translate="no">[0, 1, 3, 4]</code></p></li>
<li><p><code translate="no">&quot;ple&quot;</code> →<code translate="no">[0, 1, 2, 4]</code></p></li>
</ul>
<p>将这些列表相交会产生一个候选词：<code translate="no">[0]</code> 。</p>
<p>最后，原始<code translate="no">LIKE '%Ap%pple%'</code> 过滤器被应用于文档 0 (<code translate="no">&quot;Apple&quot;</code>)。由于它不符合完整模式，最终结果集为空。</p>
<h2 id="Limitations-and-Trade-offs-of-the-Ngram-Index" class="common-anchor-header">Ngram 索引的局限与权衡<button data-href="#Limitations-and-Trade-offs-of-the-Ngram-Index" class="anchor-icon" translate="no">
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
    </button></h2><p>虽然 Ngram 索引可以显著提高<code translate="no">LIKE</code> 的查询性能，但它也引入了一些权衡因素，在实际部署中应加以考虑。</p>
<ul>
<li><strong>索引规模增大</strong></li>
</ul>
<p>Ngram 索引的主要成本是更高的存储开销。由于索引存储的是长度在<code translate="no">min_gram</code> 和<code translate="no">max_gram</code> 之间的所有连续子串，因此随着这一范围的扩大，生成的 n-gram 数量也会迅速增加。每增加一个 n-gram 长度，就会有效地为每个文本值增加一整套重叠子串，从而增加索引键及其发布列表的数量。实际上，与标准的倒排索引相比，只需扩展一个字符的范围，索引的大小就会增加大约一倍。</p>
<ul>
<li><strong>并非对所有工作负载都有效</strong></li>
</ul>
<p>Ngram 索引并非对所有工作负载都有效。如果查询模式非常不规则，包含非常短的字面意义，或者在过滤阶段未能将数据集缩小到一个小的候选集，那么性能优势可能会受到限制。在这种情况下，即使存在索引，查询执行的成本仍可能接近全扫描的成本。</p>
<h2 id="Evaluating-Ngram-Index-Performance-on-LIKE-Queries" class="common-anchor-header">评估 LIKE 查询中的 Ngram 索引性能<button data-href="#Evaluating-Ngram-Index-Performance-on-LIKE-Queries" class="anchor-icon" translate="no">
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
    </button></h2><p>本基准测试的目的是评估 Ngram 索引在实践中如何有效地加速<code translate="no">LIKE</code> 查询。</p>
<h3 id="Test-Methodology" class="common-anchor-header">测试方法</h3><p>为了使其性能符合实际情况，我们将其与两种基准执行模式进行了比较：</p>
<ul>
<li><p><strong>主模式</strong>：不带任何索引的强制执行。</p></li>
<li><p><strong>主-倒置</strong>：使用传统的反转索引执行。</p></li>
</ul>
<p>我们设计了两个测试场景，以涵盖不同的数据特征：</p>
<ul>
<li><p><strong>维基文本数据集</strong>：100,000 行，每个文本字段截断为 1 KB。</p></li>
<li><p><strong>单字数据集</strong>：1,000,000 行，每行包含一个单词。</p></li>
</ul>
<p>在这两种情况下，均采用一致的以下设置：</p>
<ul>
<li><p>查询使用<strong>后缀匹配模式</strong>(<code translate="no">%xxx%</code>)</p></li>
<li><p>语法索引配置为<code translate="no">min_gram = 2</code> 和<code translate="no">max_gram = 4</code></p></li>
<li><p>为了隔离查询执行成本并避免结果实体化开销，所有查询都返回<code translate="no">count(*)</code> ，而不是完整的结果集。</p></li>
</ul>
<h3 id="Results" class="common-anchor-header">查询结果</h3><p><strong>维基测试，每行是内容长度截断为 1000 的维基文本，100K 行</strong></p>
<table>
<thead>
<tr><th></th><th>字面意思</th><th>时间（毫秒）</th><th>加速</th><th>计数</th></tr>
</thead>
<tbody>
<tr><td>主人</td><td>体育场</td><td>207.8</td><td></td><td>335</td></tr>
<tr><td>主-倒置</td><td></td><td>2095</td><td></td><td>335</td></tr>
<tr><td>Ngram</td><td></td><td>1.09</td><td>190 / 1922</td><td>335</td></tr>
<tr><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td>硕士</td><td>中学</td><td>204.8</td><td></td><td>340</td></tr>
<tr><td>硕士转正</td><td></td><td>2000</td><td></td><td>340</td></tr>
<tr><td>Ngram</td><td></td><td>1.26</td><td>162.5 / 1587</td><td>340</td></tr>
<tr><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td>大师</td><td>是一所男女同校的中学。</td><td>223.9</td><td></td><td>1</td></tr>
<tr><td>硕士-转制</td><td></td><td>2100</td><td></td><td>1</td></tr>
<tr><td>Ngram</td><td></td><td>1.69</td><td>132.5 / 1242.6</td><td>1</td></tr>
</tbody>
</table>
<p><strong>单词测试，1M 行</strong></p>
<table>
<thead>
<tr><th></th><th>字面</th><th>时间（毫秒）</th><th>加速</th><th>计数</th></tr>
</thead>
<tbody>
<tr><td>主控</td><td>na</td><td>128.6</td><td></td><td>40430</td></tr>
<tr><td>主-倒置</td><td></td><td>66.5</td><td></td><td>40430</td></tr>
<tr><td>Ngram</td><td></td><td>1.38</td><td>93.2 / 48.2</td><td>40430</td></tr>
<tr><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td>主</td><td>态</td><td>122</td><td></td><td>5200</td></tr>
<tr><td>主-反转</td><td></td><td>65.1</td><td></td><td>5200</td></tr>
<tr><td>Ngram</td><td></td><td>1.27</td><td>96 / 51.3</td><td>5200</td></tr>
<tr><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td>主</td><td>国家</td><td>118.8</td><td></td><td>1630</td></tr>
<tr><td>主-反转</td><td></td><td>66.9</td><td></td><td>1630</td></tr>
<tr><td>Ngram</td><td></td><td>1.21</td><td>98.2 / 55.3</td><td>1630</td></tr>
<tr><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td>主</td><td>国家</td><td>118.4</td><td></td><td>1100</td></tr>
<tr><td>主逆变</td><td></td><td>65.1</td><td></td><td>1100</td></tr>
<tr><td>Ngram</td><td></td><td>1.33</td><td>89 / 48.9</td><td>1100</td></tr>
<tr><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td>主</td><td>国家</td><td>118</td><td></td><td>1100</td></tr>
<tr><td>主国倒置</td><td></td><td>63.3</td><td></td><td>1100</td></tr>
<tr><td>Ngram</td><td></td><td>1.4</td><td>84.3 / 45.2</td><td>1100</td></tr>
</tbody>
</table>
<p><strong>注：</strong>这些结果基于 5 月份进行的基准测试。从那时起，主分支进行了更多性能优化，因此在当前版本中观察到的性能差距有望缩小。</p>
<p>基准测试结果凸显了一个清晰的模式：在所有情况下，Ngram 索引都能显著加快 LIKE 查询的速度，而查询运行速度的快慢在很大程度上取决于底层文本数据的结构和长度。</p>
<ul>
<li><p>对于<strong>长文本字段</strong>，如截断为 1,000 字节的维基风格文档，性能提升尤为明显。与没有索引的强制执行相比，Ngram 索引的速度提高了约<strong>100-200倍</strong>。与传统的倒排索引相比，改进幅度更大，达到了<strong>1,200-1,900 倍</strong>。这是因为对传统索引方法来说，对长文本进行 LIKE 查询的成本特别高，而 N-gram 查找可以迅速将搜索空间缩小到很小的候选集。</p></li>
<li><p>在由<strong>单词条目</strong>组成的数据集上，收益较小，但仍然可观。在这种情况下，N-gram 索引的运行速度比强制执行快约<strong>80-100 倍</strong>，比传统的倒排索引快<strong>45-55 倍</strong>。虽然较短文本的扫描成本较低，但基于 ngram 的方法仍能避免不必要的比较，并持续降低查询成本。</p></li>
</ul>
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
    </button></h2><p>Ngram 索引通过将文本分解为固定长度的 n-gram，并使用倒置结构为其编制索引，从而加快了<code translate="no">LIKE</code> 查询的速度。这种设计将昂贵的子串匹配转化为高效的 n-gram 查找，然后进行最少的验证。因此，既避免了全文扫描，又保留了<code translate="no">LIKE</code> 的准确语义。</p>
<p>在实践中，这种方法在各种工作负载中都很有效，尤其是在长文本字段的模糊匹配中效果显著。因此，Ngram 索引非常适合代码搜索、客户支持 Agents、法律和医学文档检索、企业知识库和学术搜索等实时场景，在这些场景中，精确的关键词匹配仍然至关重要。</p>
<p>同时，Ngram 索引还得益于精心的配置。选择合适的<code translate="no">min_gram</code> 和<code translate="no">max_gram</code> 值对于平衡索引大小和查询性能至关重要。根据实际查询模式进行调整后，Ngram 索引可为生产系统中的高性能<code translate="no">LIKE</code> 查询提供实用、可扩展的解决方案。</p>
<p>有关 Ngram 索引的更多信息，请查看下面的文档：</p>
<ul>
<li><a href="https://milvus.io/docs/ngram.md">Ngram 索引 | Milvus 文档</a></li>
</ul>
<p>对最新 Milvus 的任何功能有疑问或想深入了解？加入我们的<a href="https://discord.com/invite/8uyFbECzPX"> Discord 频道</a>或在<a href="https://github.com/milvus-io/milvus"> GitHub</a> 上提交问题。您还可以通过<a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md"> Milvus Office Hours</a> 预订 20 分钟的一对一课程，以获得见解、指导和问题解答。</p>
<h2 id="Learn-More-about-Milvus-26-Features" class="common-anchor-header">了解有关 Milvus 2.6 功能的更多信息<button data-href="#Learn-More-about-Milvus-26-Features" class="anchor-icon" translate="no">
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
<li><p><a href="https://milvus.io/blog/introduce-milvus-2-6-built-for-scale-designed-to-reduce-costs.md">介绍 Milvus 2.6：十亿规模的经济型向量搜索</a></p></li>
<li><p><a href="https://milvus.io/blog/data-in-and-data-out-in-milvus-2-6.md">介绍 Embeddings 功能：Milvus 2.6 如何简化矢量化和语义搜索</a></p></li>
<li><p><a href="https://milvus.io/blog/json-shredding-in-milvus-faster-json-filtering-with-flexibility.md">Milvus中的JSON粉碎功能：快88.9倍的灵活JSON过滤功能</a></p></li>
<li><p><a href="https://milvus.io/blog/unlocking-true-entity-level-retrieval-new-array-of-structs-and-max-sim-capabilities-in-milvus.md">解锁真正的实体级检索：Milvus 中新的结构阵列和 MAX_SIM 功能</a></p></li>
<li><p><a href="https://milvus.io/blog/unlock-geo-vector-search-with-geometry-fields-and-rtree-index-in-milvus.md">Milvus 2.6 将地理空间过滤和向量搜索与几何字段和 RTREE 结合在一起</a></p></li>
<li><p><a href="https://milvus.io/blog/introducing-aisaq-in-milvus-billion-scale-vector-search-got-3200-cheaper-on-memory.md">介绍 Milvus 中的 AISAQ：十亿规模向量搜索的内存成本降低了 3,200 倍</a></p></li>
<li><p><a href="https://milvus.io/blog/faster-index-builds-and-scalable-queries-with-gpu-cagra-in-milvus.md">在 Milvus 中优化英伟达™（NVIDIA®）CAGRA：GPU-CPU 混合方法实现更快的索引和更低的查询成本</a></p></li>
<li><p><a href="https://milvus.io/blog/minhash-lsh-in-milvus-the-secret-weapon-for-fighting-duplicates-in-llm-training-data.md">Milvus 中的 MinHash LSH：打击 LLM 训练数据中重复数据的秘密武器 </a></p></li>
<li><p><a href="https://milvus.io/blog/bring-vector-compression-to-the-extreme-how-milvus-serves-3%C3%97-more-queries-with-rabitq.md">将向量压缩发挥到极致：Milvus 如何利用 RaBitQ 提供多 3 倍的查询服务</a></p></li>
<li><p><a href="https://milvus.io/blog/benchmarks-lie-vector-dbs-deserve-a-real-test.md">基准会说谎--向量数据库需要真正的测试 </a></p></li>
<li><p><a href="https://milvus.io/blog/we-replaced-kafka-pulsar-with-a-woodpecker-for-milvus.md">我们为 Milvus 用啄木鸟取代了 Kafka/Pulsar </a></p></li>
</ul>
