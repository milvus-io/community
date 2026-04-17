---
id: molecular-structure-similarity-with-milvus.md
title: 简介
author: Shiyu Chen
date: 2020-02-06T19:08:18.815Z
desc: 如何在 Milvus 中运行分子结构相似性分析
cover: assets.zilliz.com/header_44d6b6aacd.jpg
tag: Scenarios
canonicalUrl: 'https://zilliz.com/blog/molecular-structure-similarity-with-milvus'
---
<custom-h1>加速新药研发</custom-h1><h2 id="Introduction" class="common-anchor-header">简介<button data-href="#Introduction" class="anchor-icon" translate="no">
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
    </button></h2><p>药物发现是药物创新的源泉，是新药研发的重要组成部分。药物发现是通过靶点选择和确认来实现的。当发现片段或先导化合物时，通常会在内部或商业化合物库中搜索类似化合物，以发现结构-活性关系（SAR）、化合物可用性，从而评估先导化合物优化为候选化合物的潜力。</p>
<p>为了从数十亿规模的化合物库中发现片段空间中的可用化合物，通常需要检索化学指纹来进行亚结构搜索和相似性搜索。然而，面对十亿量级的高维化学指纹，传统的解决方案既耗时又容易出错。在此过程中还可能丢失一些潜在的化合物。本文讨论了将大规模向量的相似性搜索引擎 Milvus 与 RDKit 结合使用，构建高性能化学结构相似性搜索系统。</p>
<p>与传统方法相比，Milvus 的搜索速度更快，覆盖范围更广。通过处理化学指纹，Milvus 可以在化学结构库中进行子结构搜索、相似性搜索和精确搜索，从而发现潜在的可用药物。</p>
<h2 id="System-overview" class="common-anchor-header">系统概述<button data-href="#System-overview" class="anchor-icon" translate="no">
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
    </button></h2><p>该系统使用 RDKit 生成化学指纹，使用 Milvus 进行化学结构相似性搜索。请参阅 https://github.com/milvus-io/bootcamp/tree/master/solutions/molecular_similarity_search 了解系统的更多信息。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1_system_overview_4b7c2de377.png" alt="1-system-overview.png" class="doc-image" id="1-system-overview.png" />
   </span> <span class="img-wrapper"> <span>1-system-overview.png</span> </span></p>
<h2 id="1-Generating-chemical-fingerprints" class="common-anchor-header">1.生成化学指纹<button data-href="#1-Generating-chemical-fingerprints" class="anchor-icon" translate="no">
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
    </button></h2><p>化学指纹通常用于亚结构搜索和相似性搜索。下图显示了一个用比特表示的顺序列表。每个数字代表一个元素、原子对或官能团。化学结构为<code translate="no">C1C(=O)NCO1</code> 。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/2_identifying_patterns_molecules_2aeef349c8.png" alt="2-identifying-patterns-molecules.png" class="doc-image" id="2-identifying-patterns-molecules.png" />
   </span> <span class="img-wrapper"> <span>2-identifying-patterns-molecules.png</span> </span></p>
<p>我们可以使用 RDKit 生成摩根指纹，它定义了特定原子的半径，并计算半径范围内化学结构的数量，从而生成化学指纹。为半径和位数指定不同的值，可获取不同化学结构的化学指纹。化学结构以 SMILES 格式表示。</p>
<pre><code translate="no">from rdkit import Chem
mols = Chem.MolFromSmiles(smiles)
mbfp = AllChem.GetMorganFingerprintAsBitVect(mols, radius=2, bits=512)
mvec = DataStructs.BitVectToFPSText(mbfp)
</code></pre>
<h2 id="2-Searching-chemical-structures" class="common-anchor-header">2.搜索化学结构<button data-href="#2-Searching-chemical-structures" class="anchor-icon" translate="no">
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
    </button></h2><p>然后，我们可以将摩根指纹导入 Milvus，建立化学结构数据库。通过不同的化学指纹，Milvus 可以进行子结构搜索、相似性搜索和精确搜索。</p>
<pre><code translate="no">from milvus import Milvus
Milvus.add_vectors(table_name=MILVUS_TABLE, records=mvecs)
Milvus.search_vectors(table_name=MILVUS_TABLE, query_records=query_mvec, top_k=topk)
</code></pre>
<h3 id="Substructure-search" class="common-anchor-header">子结构搜索</h3><p>检查一个化学结构是否包含另一个化学结构。</p>
<h3 id="Similarity-search" class="common-anchor-header">相似性搜索</h3><p>搜索相似的化学结构。默认使用 Tanimoto 距离作为度量标准。</p>
<h3 id="Exact-search" class="common-anchor-header">精确搜索</h3><p>检查指定的化学结构是否存在。这种搜索要求完全匹配。</p>
<h2 id="Computing-chemical-fingerprints" class="common-anchor-header">计算化学指纹<button data-href="#Computing-chemical-fingerprints" class="anchor-icon" translate="no">
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
    </button></h2><p>谷本距离通常用作化学指纹的度量。在 Milvus 中，Jaccard 距离与 Tanimoto 距离相对应。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/3_computing_chem_fingerprings_table_1_3814744fce.png" alt="3-computing-chem-fingerprings-table-1.png" class="doc-image" id="3-computing-chem-fingerprings-table-1.png" />
   </span> <span class="img-wrapper"> <span>3-computing-chem-fingerprings-table-1.png</span> </span></p>
<p>根据前面的参数，化学指纹的计算可描述为</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/4_computing_chem_fingerprings_table_2_7d16075836.png" alt="4-computing-chem-fingerprings-table-2.png" class="doc-image" id="4-computing-chem-fingerprings-table-2.png" />
   </span> <span class="img-wrapper"> <span>4-computing-chem-fingerprings-table-2.png</span> </span></p>
<p>我们可以看到<code translate="no">1- Jaccard = Tanimoto</code> 。这里我们使用 Milvus 中的 Jaccard 来计算化学指纹，实际上与 Tanimoto 距离是一致的。</p>
<h2 id="System-demo" class="common-anchor-header">系统演示<button data-href="#System-demo" class="anchor-icon" translate="no">
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
    </button></h2><p>为了更好地演示系统的工作原理，我们制作了一个演示，使用 Milvus 搜索了 9000 多万个化学指纹。使用的数据来自 ftp://ftp.ncbi.nlm.nih.gov/pubchem/Compound/CURRENT-Full/SDF。初始界面如下：</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/5_system_demo_1_46c6e6cd96.jpg" alt="5-system-demo-1.jpg" class="doc-image" id="5-system-demo-1.jpg" />
   </span> <span class="img-wrapper"> <span>5-system-demo-1.jpg</span> </span></p>
<p>我们可以在系统中搜索指定的化学结构，并返回类似的化学结构：</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/6_system_demo_2_19d6cd8f92.gif" alt="6-system-demo-2.gif" class="doc-image" id="6-system-demo-2.gif" />
   </span> <span class="img-wrapper"> <span>6-system-demo-2.gif</span> </span></p>
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
    </button></h2><p>相似性搜索在图像和视频等多个领域都不可或缺。在药物发现方面，相似性搜索可应用于化学结构数据库，以发现潜在的可用化合物，然后将其转化为种子，用于实际合成和护理点测试。Milvus作为面向大规模特征向量的开源相似性搜索引擎，采用异构计算架构，以实现最佳的成本效益。对十亿规模向量的搜索只需几毫秒，而且只需最少的计算资源。因此，Milvus 可以帮助在生物和化学等领域实现准确、快速的化学结构搜索。</p>
<p>您可以访问 http://40.117.75.127:8002/ 访问演示，同时也别忘了访问我们的 GitHub https://github.com/milvus-io/milvus 了解更多信息！</p>
