---
id: 2019-12-18-datafile-cleanup.md
title: 以往的删除策略及相关问题
author: Yihua Mo
date: 2019-12-18T00:00:00.000Z
desc: 我们改进了文件删除策略，以解决查询操作相关的问题。
cover: null
tag: Engineering
---
<custom-h1>数据文件清理机制的改进</custom-h1><blockquote>
<p>作者：莫益华莫一华</p>
<p>日期： 2019-12-18</p>
</blockquote>
<h2 id="Previous-delete-strategy-and-related-problems" class="common-anchor-header">以往的删除策略及相关问题<button data-href="#Previous-delete-strategy-and-related-problems" class="anchor-icon" translate="no">
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
    </button></h2><p>在《<a href="/blog/zh/2019-11-08-data-management.md">大规模向量搜索引擎中的数据管理</a>》中，我们提到了数据文件的删除机制。删除包括软删除和硬删除。对表执行删除操作后，表会被标记为软删除。之后的查询或更新操作不再允许。不过，删除前开始的查询操作仍可运行。只有在查询操作完成后，表才会真正连同元数据和其他文件一起删除。</p>
<p>那么，标记为软删除的文件何时真正删除？0.6.0 之前的策略是，软删除 5 分钟后文件才会被真正删除。下图显示了该策略：</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://raw.githubusercontent.com/milvus-io/community/master/blog/assets/datafile_clean/5mins.png" alt="5mins" class="doc-image" id="5mins" />
   </span> <span class="img-wrapper"> <span>5分钟</span> </span></p>
<p>该策略的前提是查询通常不会超过 5 分钟，并不可靠。如果查询持续时间超过 5 分钟，查询就会失败。原因是查询开始时，Milvus 会收集可搜索文件的信息，并创建查询任务。然后，查询调度程序会将文件逐个加载到内存中，并逐个搜索文件。如果在加载文件时文件已不存在，查询就会失败。</p>
<p>延长时间可能有助于降低查询失败的风险，但也会导致另一个问题：磁盘使用量过大。原因是当插入大量向量时，Milvus 会不断合并数据文件，即使没有查询发生，合并后的文件也不会立即从磁盘上删除。如果数据插入过快和/或插入的数据量过大，额外的磁盘使用量可能达到数十 GB。请参考下图作为示例：</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://raw.githubusercontent.com/milvus-io/community/master/blog/assets/datafile_clean/5min_result.png" alt="result" class="doc-image" id="result" />
   </span> <span class="img-wrapper"> <span>结果</span> </span></p>
<p>如上图所示，第一批插入的数据（insert_1）被刷新到磁盘并成为文件_1，然后 insert_2 成为文件_2。负责文件组合的线程将文件合并为文件_3。然后，文件_1 和文件_2 被标记为软删除。第三批插入数据变成文件_4。线程将文件_3 和文件_4 合并为文件_5，并将文件_3 和文件_4 标记为软删除。</p>
<p>同样，insert_6 和 insert_5 也被合并。在 t3 中，文件_5 和文件_6 被标记为软删除。在 t3 和 t4 之间，虽然许多文件被标记为软删除，但它们仍在磁盘中。t4 之后，文件才真正被删除。因此，在 t3 和 t4 之间，磁盘使用量为 64 + 64 + 128 + 64 + 196 + 64 + 256 = 836 MB。插入的数据为 64 + 64 + 64 + 64 = 256 MB。磁盘使用量是插入数据量的 3 倍。磁盘写入速度越快，特定时间段内的磁盘使用率就越高。</p>
<h2 id="Improvements-of-the-delete-strategy-in-060" class="common-anchor-header">0.6.0 中删除策略的改进<button data-href="#Improvements-of-the-delete-strategy-in-060" class="anchor-icon" translate="no">
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
    </button></h2><p>因此，我们在 v0.6.0 中改变了删除文件的策略。硬删除不再使用时间作为触发器。取而代之的是，当文件未被任何任务使用时才会触发。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://raw.githubusercontent.com/milvus-io/community/master/blog/assets/datafile_clean/new_strategy.png" alt="newstrategy" class="doc-image" id="newstrategy" />
   </span> <span class="img-wrapper"> <span>新策略</span> </span></p>
<p>假设插入两批向量。在 t1 中，给出一个查询请求，Milvus 获取两个要查询的文件（file_1 和 file_2，因为 file_3 仍然不存在。）然后，后端线程开始合并这两个文件，查询同时运行。文件_3 生成后，文件_1 和文件_2 被标记为软删除。查询结束后，没有其他任务会使用 file_1 和 file_2，因此它们将在 t4 中被硬删除。t2 和 t4 之间的时间间隔很小，取决于查询的时间间隔。这样，未使用的文件就会被及时删除。</p>
<p>至于内部实现，则使用软件工程师熟悉的引用计数来确定文件是否可以被硬删除。用比较法来解释，当玩家在游戏中拥有生命时，他仍然可以玩游戏。当生命值为 0 时，游戏结束。Milvus 会监控每个文件的状态。当某个任务使用某个文件时，该文件就会增加一条生命。当文件不再被使用时，将从文件中删除一条生命。当文件被标记为软删除且生命周期数为 0 时，文件就可以被硬删除了。</p>
<h2 id="Related-blogs" class="common-anchor-header">相关博客<button data-href="#Related-blogs" class="anchor-icon" translate="no">
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
<li><a href="/blog/zh/2019-11-08-data-management.md">在大规模向量搜索引擎中管理数据</a></li>
<li><a href="https://milvus.io/blog/managing-metadata-in-milvus-1.md">Milvus 元数据管理（1）：如何查看元数据</a></li>
<li><a href="/blog/zh/2019-12-27-meta-table.md">Milvus 元数据管理（2）：元数据表中的字段</a></li>
</ul>
