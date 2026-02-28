---
id: deep-dive-7-query-expression.md
title: How Does the Database Understand and Execute Your Query?
author: Milvus
date: 2022-05-05T00:00:00.000Z
desc: A vector query is the process of retrieving vectors via scalar filtering.
cover: assets.zilliz.com/Deep_Dive_7_baae830823.png
tag: Engineering
tags: 'Data science, Database, Tech, Artificial Intelligence, Vector Management'
canonicalUrl: 'https://milvus.io/blog/deep-dive-7-query-expression.md'
---
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Deep_Dive_7_baae830823.png" alt="Cover image" class="doc-image" id="cover-image" />
    <span>Cover image</span>
  </span>
</p>
<blockquote>
<p>This article is transcreated by <a href="https://www.linkedin.com/in/yiyun-n-2aa713163/">Angela Ni</a>.</p>
</blockquote>
<p>A <a href="https://milvus.io/docs/v2.0.x/query.md">vector query</a> in Milvus is the process of retrieving vectors via scalar filtering based on boolean expression. With scalar filtering, users can limit their query results with certain conditions applied on attributes of data. For instance, if a user queries for films released during 1990-2010 and with scores higher than 8.5, only films whose attributes (release year and score) fulfill the condition.</p>
<p>This post aims to examine how a query is completed in Milvus from the input of a query expression to query plan generation and query execution.</p>
<p><strong>Jump to:</strong></p>
<ul>
<li><a href="#Query-expression">Query expression</a></li>
<li><a href="#Plan-AST-generation">Plan AST generation</a></li>
<li><a href="#Query-execution">Query execution</a></li>
</ul>
<h2 id="Query-expression" class="common-anchor-header">Query expression<button data-href="#Query-expression" class="anchor-icon" translate="no">
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
    </button></h2><p>Expression of query with attribute filtering in Milvus adopts the EBNF(Extended Backus–Naur form) syntax. The image below is the expression rules in Milvus.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Expression_Syntax_966493a5be.png" alt="Expression Syntax" class="doc-image" id="expression-syntax" />
    <span>Expression Syntax</span>
  </span>
</p>
<p>Logical expressions can be created using the combination of binary logical operators, unary logical operators, logical expressions, and single expressions. Since EBNF syntax is itself recursive, a logical expression can be the outcome of the combination or part of a bigger logical expression. A logical expression can contain many sub-logical expressions. The same rule applies in Milvus. If a user needs to filter the attributes of the results with many conditions, the user can create his own set of filtering conditions by combining different logical operators and expressions.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Boolean_expression_1_dce12f8483.png" alt="Boolean expression" class="doc-image" id="boolean-expression" />
    <span>Boolean expression</span>
  </span>
</p>
<p>The image above shows part of the <a href="https://milvus.io/docs/v2.0.x/boolean.md">Boolean expression rules</a> in Milvus. Unary logical operators can be added to an expression. Currently Milvus only supports the unary logical operator &quot;not&quot;, which indicates that the system needs to take the vectors whose scalar field values do not satisfy the calculation results. Binary logical operators include “and” and &quot;or&quot;. Single expressions include term expressions and compare expressions.</p>
<p>Basic arithmetic calculation like addition, subtraction, multiplication, and division is also supported during a query in Milvus. The following image demonstrates the precedence of the operations. Operators are listed from top to bottom in descending precedence.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Precedence_b8cfbdf17b.png" alt="Precedence" class="doc-image" id="precedence" />
    <span>Precedence</span>
  </span>
</p>
<h3 id="How-a-query-expression-on-certain-films-is-processed-in-Milvus" class="common-anchor-header">How a query expression on certain films is processed in Milvus?</h3><p>Suppose there is an abundance of film data stored in Milvus and the user wants to query certain films. As an example, each film data stored in Milvus has the following five fields: film ID, release year, film type, score, and poster. In this example, the data type of film ID and release year is int64, while film scores are float point data. Also, film posters are stored in the format of float-point vectors, and film type in the format of string data. Notably, support for string data type is a new feature in Milvus 2.1.</p>
<p>For instance, if a user want to query the movies with scores higher than 8.5. The films should also be  released during a decade before 2000 to a decade after 2000 or their types should be either comedy or action movie, the user need to input the following predicate expression: <code translate="no">score &gt; 8.5 &amp;&amp; (2000 - 10 &lt; release_year &lt; 2000 + 10 || type in [comedy,action])</code>.</p>
<p>Upon receiving the query expression, the system will execute it in the following precedence:</p>
<ol>
<li>Query for films with scores higher than 8.5. The query results are called &quot;result1&quot;.</li>
<li>Calculate 2000 - 10 to get “result2” (1990).</li>
<li>Calculate 2000 + 10 to get “result3” (2010).</li>
<li>Query for films with the value of <code translate="no">release_year</code> greater than “result2” and smaller than &quot;result3&quot;. That is to say, the system needs to query for films released between 1990 and 2010. The query results are called &quot;result4&quot;.</li>
<li>Query for films that are either comedies or action movies. The query results are called &quot;result5&quot;.</li>
<li>Combine “result4” and “result5” to obtain films that are either released between 1990 and 2010 or belong to the category of comedy or action movie. The results are called &quot;result6&quot;.</li>
<li>Take the common part in “result1” and “result6” to obtain the final results satisfying all the conditions.</li>
</ol>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Frame_1_16_00972a6e5d.png" alt="Film example" class="doc-image" id="film-example" />
    <span>Film example</span>
  </span>
</p>
<h2 id="Plan-AST-generation" class="common-anchor-header">Plan AST generation<button data-href="#Plan-AST-generation" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus leverages the open-source tool <a href="https://www.antlr.org/">ANTLR</a> (ANother Tool for Language Recognition) for plan AST (abstract syntax tree) generation. ANTLR is a powerful parser generator for reading, processing, executing, or translating structure text or binary files. More specifically, ANTLR can generate a parser for building and walking parse trees based on pre-defined syntax or rules. The following image is an example in which the input expression is &quot;SP=100;&quot;. LEXER, the built-in language recognition functionality in ANTLR, generates four tokens for the input expression - &quot;SP&quot;, &quot;=&quot;, &quot;100&quot;, and &quot;;&quot;. Then the tool will further parse the four tokens to generate the corresponding parse tree.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/parse_tree_b2c3fb0b36.png" alt="parse tree" class="doc-image" id="parse-tree" />
    <span>parse tree</span>
  </span>
</p>
<p>The walker mechanism is a crucial part in the ANTLR tool. It is designed to walk through all the parse trees to examine whether each node obeys the syntax rules, or to detect certain sensitive words. Some of the relevant APIs are listed in the image below. Since ANTLR starts from the root node and goes down all the way through each sub-node to the bottom, there is no need to differentiate the order of how to walk through the parse tree.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/parse_tree_walker_9a27942502.png" alt="parse tree walker" class="doc-image" id="parse-tree-walker" />
    <span>parse tree walker</span>
  </span>
</p>
<p>Milvus generates the PlanAST for query in a similar way to the ANTLR. However, using ANTLR requires redefining rather complicated syntax rules. Therefore, Milvus adopts one of the most prevalent rules - Boolean expression rules, and depends on the <a href="https://github.com/antonmedv/expr">Expr</a> package open sourced on GitHub to query and parse the syntax of query expressions.</p>
<p>During a query with attribute filtering, Milvus will generate a primitive unsolved plan tree using ant-parser, the parsing method provided by Expr, upon receiving the query expression. The primitive plan tree we will get is a simple binary tree. Then the plan tree is fine-tuned by Expr and the built-in optimizer in Milvus. The optimizer in Milvus is quite similar to the aforementioned walker mechanism. Since the plan tree optimization functionality provided by Expr is pretty sophisticated, the burden of the Milvus built-in optimizer is alleviated to a great extent. Ultimately, the analyzer analyzes the optimized plan tree in a recursive way to generate a plan AST in the structure of <a href="https://developers.google.com/protocol-buffers">protocol buffers</a> (protobuf).</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/plan_AST_workflow_3e50b7a0d4.png" alt="plan AST workflow" class="doc-image" id="plan-ast-workflow" />
    <span>plan AST workflow</span>
  </span>
</p>
<h2 id="Query-execution" class="common-anchor-header">Query execution<button data-href="#Query-execution" class="anchor-icon" translate="no">
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
    </button></h2><p>Query execution is at root the execution of the plan AST generated in the previous steps.</p>
<p>In Milvus, a plan AST is defined in a proto structure. The image below is a message with the protobuf structure. There are six types of expressions, among which binary expression and unary expression can further have binary logical expression and unary logical expression.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Protobuf1_232132dcf2.png" alt="protobuf1" class="doc-image" id="protobuf1" />
    <span>protobuf1</span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/protobuf2_193f92f033.png" alt="protobuf2" class="doc-image" id="protobuf2" />
    <span>protobuf2</span>
  </span>
</p>
<p>The image below is a UML image of the query expression. It demonstrates the basic class and derivative class of each expression. Each class comes with a method to accept visitor parameters. This is a typical visitor design pattern. Milvus uses this pattern to execute the plan AST as its biggest advantage is that users do not have to do anything to the primitive expressions but can directly access one of the methods in the patterns to modify certain query expression class and relevant elements.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/UML_1238bc30e1.png" alt="UML" class="doc-image" id="uml" />
    <span>UML</span>
  </span>
</p>
<p>When executing a plan AST, Milvus first receives a proto-type plan node. Then a segcore-type plan node is obtained via the internal C++ proto parser. Upon obtaining the two types of plan nodes, Milvus accepts a series of class access and then modifies and executes in the internal structure of the plan nodes. Finally, Milvus searches through all the execution plan nodes to obtain the filtered results. The final results are output in the format of a bitmask. A bitmask is an array of bit numbers (“0” and “1”). Those data satisfying filter conditions are marked as “1” in the bitmask, while those do not meet the requirements are marked as “0” in the bitmask.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/execute_workflow_d89f1ee925.png" alt="execute workflow" class="doc-image" id="execute-workflow" />
    <span>execute workflow</span>
  </span>
</p>
<h2 id="About-the-Deep-Dive-Series" class="common-anchor-header">About the Deep Dive Series<button data-href="#About-the-Deep-Dive-Series" class="anchor-icon" translate="no">
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
    </button></h2><p>With the <a href="https://milvus.io/blog/2022-1-25-annoucing-general-availability-of-milvus-2-0.md">official announcement of general availability</a> of Milvus 2.0, we orchestrated this Milvus Deep Dive blog series to provide an in-depth interpretation of the Milvus architecture and source code. Topics covered in this blog series include:</p>
<ul>
<li><a href="https://milvus.io/blog/deep-dive-1-milvus-architecture-overview.md">Milvus architecture overview</a></li>
<li><a href="https://milvus.io/blog/deep-dive-2-milvus-sdk-and-api.md">APIs and Python SDKs</a></li>
<li><a href="https://milvus.io/blog/deep-dive-3-data-processing.md">Data processing</a></li>
<li><a href="https://milvus.io/blog/deep-dive-4-data-insertion-and-data-persistence.md">Data management</a></li>
<li><a href="https://milvus.io/blog/deep-dive-5-real-time-query.md">Real-time query</a></li>
<li><a href="https://milvus.io/blog/deep-dive-7-query-expression.md">Scalar execution engine</a></li>
<li><a href="https://milvus.io/blog/deep-dive-6-oss-qa.md">QA system</a></li>
<li><a href="https://milvus.io/blog/deep-dive-8-knowhere.md">Vector execution engine</a></li>
</ul>
