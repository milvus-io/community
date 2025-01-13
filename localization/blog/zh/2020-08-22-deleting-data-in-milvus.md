---
id: deleting-data-in-milvus.md
title: 总结
author: milvus
date: 2020-08-22T20:27:23.266Z
desc: 在 Milvus v0.7.0 中，我们采用了全新的设计，使删除更加高效，并支持更多索引类型。
cover: assets.zilliz.com/header_c9b45e546c.png
tag: Engineering
canonicalUrl: 'https://zilliz.com/blog/deleting-data-in-milvus'
---
<custom-h1>Milvus 如何实现删除功能</custom-h1><p>本文介绍 Milvus 如何实现删除功能。作为许多用户期待已久的功能，删除功能被引入到了 Milvus v0.7.0。我们没有直接调用 FAISS 中的 remove_ids，而是采用了全新的设计，使删除更高效，并支持更多索引类型。</p>
<p>在《<a href="https://medium.com/unstructured-data-service/how-milvus-implements-dynamic-data-update-and-query-d15e04a85e7d?source=friends_link&amp;sk=cc38bee61bc194f30324ed17e86886f3">Milvus 如何实现动态数据更新和查询》</a>一文中，我们介绍了从插入数据到刷新数据的整个过程。让我们回顾一下一些基础知识。MemManager 管理所有插入缓冲区，每个 MemTable 对应一个 Collections（我们在 Milvus v0.7.0 中将 "表 "更名为 "Collection"）。Milvus 会自动将插入内存的数据分成多个 MemTableFile。当数据刷新到磁盘时，每个 MemTableFile 都会序列化为一个原始文件。我们在设计删除函数时保留了这一架构。</p>
<p>我们将 delete 方法的功能定义为删除特定 Collections 中指定实体 ID 对应的所有数据。在开发该函数时，我们设计了两种情况。第一种是删除仍在插入缓冲区中的数据，第二种是删除已刷新到磁盘中的数据。第一种情况更直观。我们可以找到指定 ID 对应的 MemTableFile，直接删除内存中的数据（图 1）。由于删除和插入数据不能同时进行，而且在刷新数据时，MemTableFile 会从可变变为不可变，因此删除操作只能在可变缓冲区中进行。这样，删除操作就不会与数据刷新冲突，从而确保了数据的一致性。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1_delete_request_milvus_fa1e7941da.jpg" alt="1-delete-request-milvus.jpg" class="doc-image" id="1-delete-request-milvus.jpg" />
   </span> <span class="img-wrapper"> <span>1-delete-request-milvus.jpg</span> </span></p>
<p>第二种情况更为复杂，但也更为常见，因为在大多数情况下，数据在刷新到磁盘之前会在插入缓冲区中短暂停留。鉴于将刷新的数据加载到内存进行硬删除的效率很低，我们决定采用软删除这种更有效的方法。软删除不会实际删除刷新的数据，而是将已删除的 ID 保存在一个单独的文件中。这样，我们就可以在搜索等读取操作中过滤掉这些已删除的 ID。</p>
<p>说到实现，我们有几个问题需要考虑。在 Milvus 中，数据只有在刷新到磁盘时才是可见的，换句话说，才是可恢复的。因此，被刷新的数据不会在调用删除方法时删除，而是在下一次刷新操作中删除。原因是已刷新到磁盘的数据文件将不再包含新数据，因此软删除不会影响已刷新的数据。调用删除时，可以直接删除仍在插入缓冲区中的数据，而对于已刷新的数据，则需要在内存中记录已删除数据的 ID。将数据刷新到磁盘时，Milvus 会将删除的 ID 写入 DEL 文件，以记录相应段中的哪个实体被删除。这些更新只有在数据刷新完成后才能看到。图 2 展示了这一过程。在 v0.7.0 之前，我们只采用了自动冲洗机制；也就是说，Milvus 每秒都会对插入缓冲区中的数据进行序列化处理。在我们的新设计中，我们添加了一个刷新方法，允许开发人员在删除方法之后调用，确保新插入的数据可见，而删除的数据不再可恢复。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/2_delete_request_milvus_c7fc97ef07.jpg" alt="2-delete-request-milvus.jpg" class="doc-image" id="2-delete-request-milvus.jpg" />
   </span> <span class="img-wrapper"> <span>2-delete-request-milvus.jpg</span> </span></p>
<p>第二个问题是，原始数据文件和索引文件在 Milvus 中是两个独立的文件，在元数据中也是两条独立的记录。在删除指定 ID 时，我们需要找到与 ID 相对应的原始数据文件和索引文件，并将它们记录在一起。因此，我们引入了段的概念。一个段包含原始文件（其中包括原始向量文件和 ID 文件）、索引文件和 DEL 文件。段是 Milvus 中读取、写入和搜索向量的最基本单位。一个 Collection（图 3）由多个 segment 组成。因此，磁盘中一个 Collections 文件夹下有多个段文件夹。由于我们的元数据基于关系数据库（SQLite 或 MySQL），因此记录段内关系非常简单，删除操作也不再需要分别处理原始文件和索引文件。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/3_delete_request_milvus_ee40340279.jpg" alt="3-delete-request-milvus.jpg" class="doc-image" id="3-delete-request-milvus.jpg" />
   </span> <span class="img-wrapper"> <span>3-delete-request-milvus.jpg</span> </span></p>
<p>第三个问题是如何在搜索过程中过滤掉已删除的数据。实际上，DEL 记录的 ID 是存储在段中的相应数据的偏移量。由于刷新的数据段不包含新数据，因此偏移量不会改变。DEL 的数据结构是内存中的一个位图，其中一个有效位代表一个已删除的偏移量。我们也对 FAISS 进行了相应的更新：在 FAISS 中搜索时，活动位对应的向量将不再包含在距离计算中（图 4）。这里不详细讨论 FAISS 的变化。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/4_delete_request_milvus_f5a29e25df.jpg" alt="4-delete-request-milvus.jpg" class="doc-image" id="4-delete-request-milvus.jpg" />
   </span> <span class="img-wrapper"> <span>4-delete-request-milvus.jpg</span> </span></p>
<p>最后一个问题与性能改进有关。删除已刷新数据时，首先需要找出被删除的 ID 在 Collections 的哪个区段，然后记录其偏移量。最直接的方法是搜索每个段中的所有 ID。我们正在考虑的优化方法是在每个段中添加 Bloom 过滤器。Bloom 过滤器是一种随机数据结构，用于检查某个元素是否是某个集合的成员。因此，我们可以只加载每个段的 Bloom 过滤器。只有当 bloom 过滤器确定被删除的 ID 位于当前数据段中时，我们才能在该数据段中找到相应的偏移量；否则，我们可以忽略该数据段（图 5）。我们之所以选择 bloom 过滤器，是因为与哈希表等许多同类产品相比，它占用的空间更少，搜索效率更高。虽然 bloom 过滤器有一定的误报率，但我们可以将需要搜索的数据段减少到理想的数量，从而调整误报率。同时，bloom 过滤器还需要支持删除功能。否则，已删除的实体 ID 仍然可以在 bloom 过滤器中找到，从而导致假阳性率增加。因此，我们使用了计数型 bloom 过滤器，因为它支持删除。在本文中，我们将不再详述 bloom 过滤器的工作原理。如果您感兴趣，可以参考维基百科。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/5_delete_request_milvus_bd26633b55.jpg" alt="5-delete-request-milvus.jpg" class="doc-image" id="5-delete-request-milvus.jpg" />
   </span> <span class="img-wrapper"> <span>5-delete-request-milvus.jpg</span> </span></p>
<h2 id="Wrapping-up" class="common-anchor-header">总结<button data-href="#Wrapping-up" class="anchor-icon" translate="no">
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
    </button></h2><p>到目前为止，我们已经向大家简要介绍了 Milvus 如何通过 ID 删除向量。如你所知，我们使用软删除来删除刷新的数据。随着删除数据的增加，我们需要压缩 Collections 中的段，以释放被删除数据占用的空间。此外，如果某个数据段已经建立了索引，那么压缩也会删除之前的索引文件并创建新的索引。目前，开发人员需要调用 compact 方法来压缩数据。今后，我们希望引入检查机制。例如，当删除的数据量达到一定阈值或删除后数据分布发生变化时，Milvus 会自动压缩该数据段。</p>
<p>现在，我们介绍了删除函数背后的设计理念及其实现方法。我们肯定还有改进的余地，欢迎您提出任何意见或建议。</p>
<p>了解 Milvus：https://github.com/milvus-io/milvus。您也可以加入我们的社区<a href="https://milvusio.slack.com/join/shared_invite/zt-e0u4qu3k-bI2GDNys3ZqX1YCJ9OM~GQ#/">Slack</a>进行技术讨论！</p>
