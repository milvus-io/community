---
id: dynamically-change-log-levels-in-the-milvus-vector-database.md
title: Milvusベクターデータベースのログレベルを動的に変更する
author: Enwei Jiao
date: 2022-09-21T00:00:00.000Z
desc: Milvusでサービスを再起動せずにログレベルを調整する方法をご紹介します。
cover: >-
  assets.zilliz.com/Dynamically_Change_Log_Levels_in_the_Milvus_Vector_Database_58e31c66cc.png
tag: Engineering
tags: 'Vector Database for AI, Artificial Intelligence, Machine Learning'
canonicalUrl: >-
  https://milvus.io/blog/dynamically-change-log-levels-in-the-milvus-vector-database.md
---
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Dynamically_Change_Log_Levels_in_the_Milvus_Vector_Database_58e31c66cc.png" alt="Cover image" class="doc-image" id="cover-image" />
   </span> <span class="img-wrapper"> <span>表紙画像</span> </span></p>
<blockquote>
<p>この記事は<a href="https://github.com/jiaoew1991">Enwei Jiaoが</a>執筆し、<a href="https://www.linkedin.com/in/yiyun-n-2aa713163/">Angela Niが</a>翻訳した。</p>
</blockquote>
<p>ログの過剰出力によるディスクやシステムのパフォーマンスへの影響を防ぐため、Milvusはデフォルトで、実行中に<code translate="no">info</code> レベルのログを出力する。しかし、<code translate="no">info</code> レベルのログでは、バグや問題を効率的に特定するのに十分でない場合がある。さらに悪いことに、ログレベルを変更してサービスを再起動しても問題の再現に失敗し、トラブルシューティングがより困難になるケースもあります。そのため、Milvusベクターデータベースのログレベルを動的に変更する機能が急務となっている。</p>
<p>本稿では、Milvusベクトルデータベースにおいて、ログレベルを動的に変更するための仕組みとその方法を紹介する。</p>
<p><strong>ジャンプ</strong></p>
<ul>
<li><a href="#Mechanism">仕組み</a></li>
<li><a href="#How-to-dynamically-change-log-levels">ログレベルを動的に変更する方法</a></li>
</ul>
<h2 id="Mechanism" class="common-anchor-header">仕組み<button data-href="#Mechanism" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvusベクターデータベースでは、Uber社がオープンソース化している<a href="https://github.com/uber-go/zap">zap</a>loggerを採用しています。Go言語のエコシステムで最も強力なログコンポーネントの1つであるzapには<a href="https://github.com/uber-go/zap/blob/master/http_handler.go">http_handler.go</a>モジュールが組み込まれており、HTTPインターフェースを介して現在のログレベルを表示したり、動的にログレベルを変更したりすることができます。</p>
<p>milvusは、<code translate="no">9091</code> ポートで提供されるHTTPサービスをリッスンします。したがって、<code translate="no">9091</code> ポートにアクセスして、パフォーマンスデバッグ、メトリクス、ヘルスチェックなどの機能を利用することができます。同様に、<code translate="no">9091</code> ポートは動的なログレベルの変更を可能にするために再利用され、<code translate="no">/log/level</code> パスもポートに追加されます。詳細については、<a href="https://github.com/milvus-io/milvus/pull/18430"> ログ・インターフェースPRを</a>参照してください。</p>
<h2 id="How-to-dynamically-change-log-levels" class="common-anchor-header">ログレベルを動的に変更する方法<button data-href="#How-to-dynamically-change-log-levels" class="anchor-icon" translate="no">
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
    </button></h2><p>このセクションでは、実行中のMilvusサービスを再起動することなく、動的にログレベルを変更する方法について説明します。</p>
<h3 id="Prerequisite" class="common-anchor-header">前提条件</h3><p>Milvusコンポーネントの<code translate="no">9091</code> ポートにアクセスできることを確認する。</p>
<h3 id="Change-the-log-level" class="common-anchor-header">ログレベルの変更</h3><p>MilvusプロキシのIPアドレスが<code translate="no">192.168.48.12</code> であるとする。</p>
<p>まず<code translate="no">$ curl -X GET 192.168.48.12:9091/log/level</code> を実行してプロキシの現在のログレベルを確認する。</p>
<p>その後、ログレベルを指定して調整することができます。ログレベルのオプションには以下のものがある：</p>
<ul>
<li><p><code translate="no">debug</code></p></li>
<li><p><code translate="no">info</code></p></li>
<li><p><code translate="no">warn</code></p></li>
<li><p><code translate="no">error</code></p></li>
<li><p><code translate="no">dpanic</code></p></li>
<li><p><code translate="no">panic</code></p></li>
<li><p><code translate="no">fatal</code></p></li>
</ul>
<p>以下のコード例では、ログレベルをデフォルトのログレベルから<code translate="no">info</code> から<code translate="no">error</code> に変更している。</p>
<pre><code translate="no" class="language-Python">$ curl -X PUT 192.168.48.12:9091/log/level -d level=error
<button class="copy-code-btn"></button></code></pre>
