---
id: deep-dive-7-query-expression.md
title: 数据库如何理解和执行您的查询？
author: Milvus
date: 2022-05-05T00:00:00.000Z
desc: 向量查询是通过标量过滤检索向量的过程。
cover: assets.zilliz.com/Deep_Dive_7_baae830823.png
tag: Engineering
tags: 'Data science, Database, Tech, Artificial Intelligence, Vector Management'
canonicalUrl: 'https://milvus.io/blog/deep-dive-7-query-expression.md'
---
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Deep_Dive_7_baae830823.png" alt="Cover image" class="doc-image" id="cover-image" />
   </span> <span class="img-wrapper"> <span>封面图片</span> </span></p>
<blockquote>
<p>本文由<a href="https://www.linkedin.com/in/yiyun-n-2aa713163/">Angela Ni</a> 译。</p>
</blockquote>
<p>在 Milvus 中，<a href="https://milvus.io/docs/v2.0.x/query.md">向量查询</a>是通过基于布尔表达式的标量过滤检索向量的过程。通过标量过滤，用户可以根据数据属性的某些条件限制查询结果。例如，如果用户查询 1990-2010 年间上映且评分高于 8.5 分的电影，那么只有属性（上映年份和评分）符合条件的电影才能被查询到。</p>
<p>本文章旨在探讨 Milvus 如何完成从输入查询表达式到生成查询计划和执行查询的整个查询过程。</p>
<p><strong>跳转到</strong></p>
<ul>
<li><a href="#Query-expression">查询表达式</a></li>
<li><a href="#Plan-AST-generation">生成计划 AST</a></li>
<li><a href="#Query-execution">查询执行</a></li>
</ul>
<h2 id="Query-expression" class="common-anchor-header">查询表达式<button data-href="#Query-expression" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 中带有属性过滤的查询表达式采用 EBNF（Extended Backus-Naur form）语法。下图是 Milvus 中的表达规则。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Expression_Syntax_966493a5be.png" alt="Expression Syntax" class="doc-image" id="expression-syntax" />
   </span> <span class="img-wrapper"> <span>表达式语法</span> </span></p>
<p>逻辑表达式可以使用二元逻辑操作符、一元逻辑操作符、逻辑表达式和单表达式的组合来创建。由于 EBNF 语法本身具有递归性，因此逻辑表达式可以是更大逻辑表达式的组合结果或一部分。一个逻辑表达式可以包含许多子逻辑表达式。同样的规则也适用于 Milvus。如果用户需要用许多条件来筛选结果的属性，用户可以通过组合不同的逻辑操作符和表达式来创建自己的筛选条件集。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Boolean_expression_1_dce12f8483.png" alt="Boolean expression" class="doc-image" id="boolean-expression" />
   </span> <span class="img-wrapper"> <span>布尔表达式</span> </span></p>
<p>上图显示了 Milvus 中<a href="https://milvus.io/docs/v2.0.x/boolean.md">布尔表达式规则</a>的一部分。一元逻辑操作符可以添加到表达式中。目前 Milvus 只支持一元逻辑操作符 &quot;not&quot;，表示系统需要取标量域值不满足计算结果的向量。二元逻辑操作符包括 &quot;和 &quot;和 &quot;或&quot;。单表达式包括项表达式和比较表达式。</p>
<p>在 Milvus 查询过程中，还支持加、减、乘、除等基本算术计算。下图展示了操作符的优先级。操作符从上到下按优先级降序排列。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Precedence_b8cfbdf17b.png" alt="Precedence" class="doc-image" id="precedence" />
   </span> <span class="img-wrapper"> <span>优先级</span> </span></p>
<h3 id="How-a-query-expression-on-certain-films-is-processed-in-Milvus" class="common-anchor-header">Milvus 如何处理对某些胶片的查询表达式？</h3><p>假设 Milvus 中存储了大量影片数据，用户想查询某些影片。举例来说，Milvus 中存储的每部影片数据都有以下五个字段：影片 ID、上映年份、影片类型、配乐和海报。在本例中，电影 ID 和上映年份的数据类型为 int64，而电影分数则为浮点数据。另外，电影海报以浮点向量格式存储，电影类型以字符串数据格式存储。值得注意的是，支持字符串数据类型是 Milvus 2.1 的一项新功能。</p>
<p>例如，如果用户想查询得分高于 8.5 分的电影。这些电影还必须是在 2000 年之前的十年到 2000 年之后的十年间上映的，或者它们的类型必须是喜剧片或动作片，那么用户需要输入以下谓词表达式：<code translate="no">score &gt; 8.5 &amp;&amp; (2000 - 10 &lt; release_year &lt; 2000 + 10 || type in [comedy,action])</code> 。</p>
<p>收到查询表达式后，系统将按以下优先顺序执行：</p>
<ol>
<li>查询得分高于 8.5 分的电影。查询结果称为 &quot;result1&quot;。</li>
<li>计算 2000 - 10，得到 "result2"（1990）。</li>
<li>计算 2000 + 10，得到 "result3"（2010 年）。</li>
<li>查询<code translate="no">release_year</code> 的值大于 &quot;result2 &quot;且小于 &quot;result3 &quot;的电影。也就是说，系统需要查询 1990 年至 2010 年上映的电影。查询结果称为 &quot;result4&quot;。</li>
<li>查询喜剧片或动作片。查询结果称为 &quot;result5&quot;。</li>
<li>将 "result4 "和 "result5 "合并，得到在 1990 年至 2010 年间上映或属于喜剧片或动作片类别的影片。结果称为 &quot;result6&quot;。</li>
<li>取 "result1 "和 "result6 "中的公共部分，得到满足所有条件的最终结果。</li>
</ol>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Frame_1_16_00972a6e5d.png" alt="Film example" class="doc-image" id="film-example" />
   </span> <span class="img-wrapper"> <span>电影示例</span> </span></p>
<h2 id="Plan-AST-generation" class="common-anchor-header">生成计划 AST<button data-href="#Plan-AST-generation" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 利用开源工具<a href="https://www.antlr.org/">ANTLR</a>（ANother Tool for Language Recognition）来生成计划 AST（抽象语法树）。ANTLR 是一种功能强大的解析器生成器，用于读取、处理、执行或翻译结构文本或二进制文件。更具体地说，ANTLR 可以生成一个解析器，用于根据预定义的语法或规则构建和行走解析树。下图是一个输入表达式为 &quot;SP=100; &quot;的示例。ANTLR 内置的语言识别功能 LEXER 会为输入表达式生成四个标记--&quot;SP&quot;、&quot;=&quot;、&quot;100 &quot;和&quot;;&quot;。然后，该工具将进一步解析这四个词素，生成相应的解析树。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/parse_tree_b2c3fb0b36.png" alt="parse tree" class="doc-image" id="parse-tree" />
   </span> <span class="img-wrapper"> <span>解析树</span> </span></p>
<p>走读机制是 ANTLR 工具的关键部分。它的作用是遍历所有解析树，检查每个节点是否符合语法规则，或检测某些敏感词。下图列出了一些相关的 API。由于 ANTLR 从根节点开始，通过每个子节点一直走到底部，因此无需区分解析树的行走顺序。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/parse_tree_walker_9a27942502.png" alt="parse tree walker" class="doc-image" id="parse-tree-walker" />
   </span> <span class="img-wrapper"> <span>解析树行走器</span> </span></p>
<p>Milvus 生成查询用 PlanAST 的方式与 ANTLR 类似。不过，使用 ANTLR 需要重新定义相当复杂的语法规则。因此，Milvus 采用了一种最普遍的规则--布尔表达式规则，并依赖于 GitHub 上开源的<a href="https://github.com/antonmedv/expr">Expr</a>包来查询和解析查询表达式的语法。</p>
<p>在带属性过滤的查询过程中，Milvus 会在接收到查询表达式后使用 Expr 提供的解析方法 ant-parser 生成一棵原始的未解计划树。我们将得到的原始计划树是一棵简单的二叉树。然后，Expr 和 Milvus 内置的优化器会对计划树进行微调。Milvus 中的优化器与前述的步行者机制颇为相似。由于 Expr 提供的计划树优化功能相当复杂，因此在很大程度上减轻了 Milvus 内置优化器的负担。最终，分析器会以递归方式分析优化后的计划树，以<a href="https://developers.google.com/protocol-buffers">协议缓冲区</a>（protobuf）的结构生成计划 AST。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/plan_AST_workflow_3e50b7a0d4.png" alt="plan AST workflow" class="doc-image" id="plan-ast-workflow" />
   </span> <span class="img-wrapper"> <span>计划 AST 工作流程</span> </span></p>
<h2 id="Query-execution" class="common-anchor-header">查询执行<button data-href="#Query-execution" class="anchor-icon" translate="no">
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
    </button></h2><p>查询执行的根本是执行前面步骤中生成的计划 AST。</p>
<p>在 Milvus 中，计划 AST 是在 proto 结构中定义的。下图是带有 protobuf 结构的信息。有六种表达式，其中二进制表达式和一元表达式可以进一步分为二进制逻辑表达式和一元逻辑表达式。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Protobuf1_232132dcf2.png" alt="protobuf1" class="doc-image" id="protobuf1" />
   </span> <span class="img-wrapper"> <span>原语 1</span> </span></p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/protobuf2_193f92f033.png" alt="protobuf2" class="doc-image" id="protobuf2" />
   </span> <span class="img-wrapper"> <span>protobuf2</span> </span></p>
<p>下图是查询表达式的 UML 图像。它展示了每个表达式的基本类和派生类。每个类都有一个接受访问者参数的方法。这是一种典型的访问者设计模式。Milvus 使用这种模式来执行计划 AST，因为它的最大优点是用户不必对原始表达式做任何操作，而是可以直接访问模式中的某个方法来修改某些查询表达式类和相关元素。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/UML_1238bc30e1.png" alt="UML" class="doc-image" id="uml" />
   </span> <span class="img-wrapper"> <span>UML</span> </span></p>
<p>在执行计划 AST 时，Milvus 首先接收一个原型计划节点。然后，通过内部 C++ 原型解析器获得 segcore 类型的计划节点。获得这两种类型的计划节点后，Milvus 会接受一系列类访问，然后在计划节点的内部结构中进行修改和执行。最后，Milvus 对所有执行计划节点进行搜索，获得过滤后的结果。最终结果以位掩码的格式输出。位掩码是一个位数数组（"0 "和 "1"）。满足筛选条件的数据在位掩码中标记为 "1"，不满足筛选条件的数据在位掩码中标记为 "0"。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/execute_workflow_d89f1ee925.png" alt="execute workflow" class="doc-image" id="execute-workflow" />
   </span> <span class="img-wrapper"> <span>执行工作流程</span> </span></p>
<h2 id="About-the-Deep-Dive-Series" class="common-anchor-header">关于深度学习系列<button data-href="#About-the-Deep-Dive-Series" class="anchor-icon" translate="no">
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
    </button></h2><p>随着 Milvus 2.0<a href="https://milvus.io/blog/2022-1-25-annoucing-general-availability-of-milvus-2-0.md">正式宣布全面上市</a>，我们精心策划了这个 Milvus 深度剖析系列博客，对 Milvus 架构和源代码进行深入解读。本系列博客涉及的主题包括</p>
<ul>
<li><a href="https://milvus.io/blog/deep-dive-1-milvus-architecture-overview.md">Milvus 架构概述</a></li>
<li><a href="https://milvus.io/blog/deep-dive-2-milvus-sdk-and-api.md">应用程序接口和 Python SDK</a></li>
<li><a href="https://milvus.io/blog/deep-dive-3-data-processing.md">数据处理</a></li>
<li><a href="https://milvus.io/blog/deep-dive-4-data-insertion-and-data-persistence.md">数据管理</a></li>
<li><a href="https://milvus.io/blog/deep-dive-5-real-time-query.md">实时查询</a></li>
<li><a href="https://milvus.io/blog/deep-dive-7-query-expression.md">标量执行引擎</a></li>
<li><a href="https://milvus.io/blog/deep-dive-6-oss-qa.md">质量保证系统</a></li>
<li><a href="https://milvus.io/blog/deep-dive-8-knowhere.md">向量执行引擎</a></li>
</ul>
