---
id: deep-dive-7-query-expression.md
title: 資料庫如何理解並執行您的查詢？
author: Milvus
date: 2022-05-05T00:00:00.000Z
desc: 向量查詢是透過標量篩選來擷取向量的過程。
cover: assets.zilliz.com/Deep_Dive_7_baae830823.png
tag: Engineering
tags: 'Data science, Database, Tech, Artificial Intelligence, Vector Management'
canonicalUrl: 'https://milvus.io/blog/deep-dive-7-query-expression.md'
---
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Deep_Dive_7_baae830823.png" alt="Cover image" class="doc-image" id="cover-image" />
   </span> <span class="img-wrapper"> <span>封面圖片</span> </span></p>
<blockquote>
<p>本文由<a href="https://www.linkedin.com/in/yiyun-n-2aa713163/">Angela Ni</a> 轉載。</p>
</blockquote>
<p>在 Milvus 中，<a href="https://milvus.io/docs/v2.0.x/query.md">向量查詢</a>是透過基於布林表達式的標量篩選來擷取向量的過程。透過標量篩選，使用者可以根據資料屬性的特定條件限制查詢結果。例如，如果使用者查詢 1990-2010 年間上映且分數高於 8.5 的電影，則只有屬性（上映年份和分數）符合條件的電影才會出現。</p>
<p>這篇文章的目的在於檢視 Milvus 如何完成從查詢表達式的輸入、查詢計畫的產生到查詢執行的過程。</p>
<p><strong>跳到</strong></p>
<ul>
<li><a href="#Query-expression">查詢表達式</a></li>
<li><a href="#Plan-AST-generation">計畫 AST 產生</a></li>
<li><a href="#Query-execution">查詢執行</a></li>
</ul>
<h2 id="Query-expression" class="common-anchor-header">查詢表達<button data-href="#Query-expression" class="anchor-icon" translate="no">
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
    </button></h2><p>在 Milvus 中，屬性篩選的查詢表達採用 EBNF（Extended Backus-Naur form）語法。下圖是 Milvus 的表達規則。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Expression_Syntax_966493a5be.png" alt="Expression Syntax" class="doc-image" id="expression-syntax" />
   </span> <span class="img-wrapper"> <span>表達語法</span> </span></p>
<p>邏輯表達式可以使用二元邏輯運算符、一元邏輯運算符、邏輯表達式和單一表達式的組合來建立。由於 EBNF 語法本身是遞歸的，一個邏輯表達式可以是一個更大的邏輯表達式的組合結果或一部分。一個邏輯表達式可以包含許多子邏輯表達式。同樣的規則也適用於 Milvus。如果使用者需要用許多條件來篩選結果的屬性，使用者可以透過組合不同的邏輯運算符和表達式來建立自己的篩選條件集。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Boolean_expression_1_dce12f8483.png" alt="Boolean expression" class="doc-image" id="boolean-expression" />
   </span> <span class="img-wrapper"> <span>布林表達式</span> </span></p>
<p>上圖顯示 Milvus 中部分<a href="https://milvus.io/docs/v2.0.x/boolean.md">布林表達規則</a>。單元邏輯運算符可加入到表達式中。目前 Milvus 只支援單元邏輯運算符號「not」，表示系統需要取其標量值欄位值不滿足計算結果的向量。二元邏輯運算符包括 &quot;and 「和 」or&quot;。單一表達式包括項表達式和比較表達式。</p>
<p>在 Milvus 的查詢過程中，也支援加、減、乘、除等基本算術運算。下圖展示了運算符號的優先順序。運算符號從上至下依序排列。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Precedence_b8cfbdf17b.png" alt="Precedence" class="doc-image" id="precedence" />
   </span> <span class="img-wrapper"> <span>優先順序</span> </span></p>
<h3 id="How-a-query-expression-on-certain-films-is-processed-in-Milvus" class="common-anchor-header">在 Milvus 中如何處理關於某些影片的查詢表達式？</h3><p>假設 Milvus 儲存了大量的影片資料，而使用者想要查詢某些影片。舉例來說，Milvus 儲存的每部電影資料都有以下五個欄位：電影 ID、上映年份、電影類型、配樂和海報。在此範例中，電影 ID 和上映年份的資料類型為 int64，而電影得分則為浮點資料。此外，電影海報以浮點向量的格式儲存，而電影類型則以字串資料的格式儲存。值得注意的是，支援字串資料類型是 Milvus 2.1 的新功能。</p>
<p>舉例來說，如果使用者想要查詢分數高於 8.5 分的電影。例如，如果使用者要查詢得分高於 8.5 分的電影，而且這些電影必須是在 2000 年之前的十年至 2000 年之後的十年間上映，或是其類型必須是喜劇或動作片，則使用者需要輸入以下的謂語表達式：<code translate="no">score &gt; 8.5 &amp;&amp; (2000 - 10 &lt; release_year &lt; 2000 + 10 || type in [comedy,action])</code> 。</p>
<p>收到查詢表達式後，系統會依下列優先順序執行：</p>
<ol>
<li>查詢分數高於 8.5 的電影。查詢結果稱為「result1」。</li>
<li>計算 2000 - 10 得到 "result2" (1990)。</li>
<li>計算 2000 + 10 得到 "result3" (2010)。</li>
<li>查詢<code translate="no">release_year</code> 的值大於 &quot;result2 「且小於 」result3 &quot;的電影。也就是說，系統需要查詢 1990 年至 2010 年間上映的電影。查詢結果稱為「result4」。</li>
<li>查詢屬於喜劇片或動作片的電影。查詢結果稱為「result5」。</li>
<li>結合「result4」和「result5」，取得在 1990 年至 2010 年間上映，或屬於喜劇片或動作片類別的電影。結果稱為 &quot;result6&quot;。</li>
<li>取「結果 1」與「結果 6」的共同部分，得到符合所有條件的最終結果。</li>
</ol>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Frame_1_16_00972a6e5d.png" alt="Film example" class="doc-image" id="film-example" />
   </span> <span class="img-wrapper"> <span>電影範例</span> </span></p>
<h2 id="Plan-AST-generation" class="common-anchor-header">計劃 AST 生成<button data-href="#Plan-AST-generation" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 利用開放原始碼工具<a href="https://www.antlr.org/">ANTLR</a>(ANother Tool for Language Recognition) 來產生計劃 AST (抽象語法樹)。ANTLR 是一個功能強大的解析器產生器，用於讀取、處理、執行或翻譯結構文字或二進位檔案。更明顯的是，ANTLR 可以根據預先定義的語法或規則，產生建立和行走解析樹的解析器。下圖是輸入表達式為 &quot;SP=100;&quot; 的範例。ANTLR 內建的語言識別功能 LEXER 會為輸入的表達式產生四個標記 - &quot;SP&quot;、&quot;=&quot;、&quot;100&quot;、&quot;;&quot;。然後工具會進一步解析這四個詞彙，產生相對應的解析樹。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/parse_tree_b2c3fb0b36.png" alt="parse tree" class="doc-image" id="parse-tree" />
   </span> <span class="img-wrapper"> <span>解析樹</span> </span></p>
<p>行走機制是 ANTLR 工具中的重要部分。它的設計目的是在所有的解析樹中行走，以檢查每個節點是否遵守語法規則，或是偵測某些敏感字詞。下圖列出了一些相關的 API。由於 ANTLR 是從根節點開始，一路通過每個子節點到底，所以不需要區分如何走過解析樹的順序。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/parse_tree_walker_9a27942502.png" alt="parse tree walker" class="doc-image" id="parse-tree-walker" />
   </span> <span class="img-wrapper"> <span>解析樹步行器</span> </span></p>
<p>Milvus 以類似 ANTLR 的方式產生查詢用的 PlanAST。然而，使用 ANTLR 需要重新定義相當複雜的語法規則。因此，Milvus 採用最普遍的規則之一 - 布林表達規則，並依賴 GitHub 上開放的<a href="https://github.com/antonmedv/expr">Expr</a>套件來查詢和解析查詢表達式的語法。</p>
<p>在進行屬性篩選的查詢時，Milvus 會在接收到查詢表達式後，使用 Expr 提供的解析方法 ant-parser 來產生原始的未解決計畫樹。我們會得到的原始計畫樹是一棵簡單的二進位樹。之後，Expr 和 Milvus 內建的最佳化器會對計劃樹進行微調。Milvus 中的最佳化器與前述的 walker 機制相當類似。由於 Expr 提供的計劃樹最佳化功能相當複雜，因此在很大程度上減輕了 Milvus 內建最佳化器的負擔。最後，分析器會以遞歸的方式分析已優化的計劃樹，<a href="https://developers.google.com/protocol-buffers">以協議緩衝區</a>(protobuf) 的結構產生計劃 AST。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/plan_AST_workflow_3e50b7a0d4.png" alt="plan AST workflow" class="doc-image" id="plan-ast-workflow" />
   </span> <span class="img-wrapper"> <span>計劃 AST 工作流程</span> </span></p>
<h2 id="Query-execution" class="common-anchor-header">查詢執行<button data-href="#Query-execution" class="anchor-icon" translate="no">
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
    </button></h2><p>查詢執行的根本是執行前面步驟所產生的 plan AST。</p>
<p>在 Milvus 中，計劃 AST 定義在 proto 結構中。下圖是 protobuf 結構的訊息。有六種表達方式，其中二元表達方式和一元表達方式可以進一步有二元邏輯表達方式和一元邏輯表達方式。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Protobuf1_232132dcf2.png" alt="protobuf1" class="doc-image" id="protobuf1" />
   </span> <span class="img-wrapper"> <span>protobuf1</span> </span></p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/protobuf2_193f92f033.png" alt="protobuf2" class="doc-image" id="protobuf2" />
   </span> <span class="img-wrapper"> <span>protobuf2</span> </span></p>
<p>下圖是查詢表達式的 UML 圖像。它展示了每個表達式的基本類別和衍生類別。每個類別都附有接受訪客參數的方法。這是典型的訪問者設計模式。Milvus 使用這個模式來執行計劃 AST，因為它最大的優點是使用者不需要對基本表達式做任何動作，而是可以直接存取模式中的一個方法來修改某些查詢表達式類別和相關元素。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/UML_1238bc30e1.png" alt="UML" class="doc-image" id="uml" />
   </span> <span class="img-wrapper"> <span>UML</span> </span></p>
<p>當執行一個 Plan AST 時，Milvus 首先會接收到一個 proto-type Plan 節點。然後，透過內部 C++ proto 解析器取得 segcore 類型的計劃節點。取得這兩種類型的計畫節點後，Milvus 會接受一系列的類別存取，然後在計畫節點的內部結構中修改並執行。最後，Milvus 會搜尋所有的執行計畫節點，以獲得篩選後的結果。最後的結果會以 bitmask 的格式輸出。位元掩碼是位元數（"0 「和 」1"）的陣列。符合篩選條件的資料在位元掩碼中標記為 "1「，而不符合要求的資料在位元掩碼中標記為 」0"。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/execute_workflow_d89f1ee925.png" alt="execute workflow" class="doc-image" id="execute-workflow" />
   </span> <span class="img-wrapper"> <span>執行工作流程</span> </span></p>
<h2 id="About-the-Deep-Dive-Series" class="common-anchor-header">關於 Deep Dive 系列<button data-href="#About-the-Deep-Dive-Series" class="anchor-icon" translate="no">
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
    </button></h2><p>隨著 Milvus 2.0<a href="https://milvus.io/blog/2022-1-25-annoucing-general-availability-of-milvus-2-0.md">正式宣布全面上市</a>，我們精心策劃了這個 Milvus Deep Dive 系列部落格，提供對 Milvus 架構和原始碼的深入詮釋。本系列部落格涵蓋的主題包括</p>
<ul>
<li><a href="https://milvus.io/blog/deep-dive-1-milvus-architecture-overview.md">Milvus 架構概述</a></li>
<li><a href="https://milvus.io/blog/deep-dive-2-milvus-sdk-and-api.md">API 與 Python SDK</a></li>
<li><a href="https://milvus.io/blog/deep-dive-3-data-processing.md">資料處理</a></li>
<li><a href="https://milvus.io/blog/deep-dive-4-data-insertion-and-data-persistence.md">資料管理</a></li>
<li><a href="https://milvus.io/blog/deep-dive-5-real-time-query.md">即時查詢</a></li>
<li><a href="https://milvus.io/blog/deep-dive-7-query-expression.md">標量執行引擎</a></li>
<li><a href="https://milvus.io/blog/deep-dive-6-oss-qa.md">QA 系統</a></li>
<li><a href="https://milvus.io/blog/deep-dive-8-knowhere.md">向量執行引擎</a></li>
</ul>
