---
id: json-shredding-in-milvus-faster-json-filtering-with-flexibility.md
title: MilvusのJSONシュレッダー：柔軟性を備えた88.9倍高速なJSONフィルタリング
author: Jack Zhang
date: 2025-12-04T00:00:00.000Z
cover: assets.zilliz.com/Milvus_Week_JSON_Shredding_cover_829a12b086.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Milvus, JSON Shredding, JSON performance, columnar storage'
meta_title: |
  Milvus JSON Shredding: Faster JSON Filtering With Flexibility
desc: >-
  Milvus JSON
  Shreddingが最適化されたカラム型ストレージを使用し、スキーマの柔軟性を維持しながらJSONクエリを最大89倍高速化する方法をご覧ください。
origin: >-
  https://milvus.io/blog/json-shredding-in-milvus-faster-json-filtering-with-flexibility.md
---
<p>最新のAIシステムは、かつてないほど多くの半構造化JSONデータを生成している。顧客情報や製品情報はJSONオブジェクトにコンパクト化され、マイクロサービスはリクエストごとにJSONログを発行し、IoTデバイスはセンサーの読み取り値を軽量のJSONペイロードでストリーミングし、今日のAIアプリケーションは構造化された出力のためにますますJSONを標準化するようになっています。その結果、ベクトルデータベースにJSONのようなデータが大量に流れ込むことになる。</p>
<p>従来、JSONドキュメントを扱うには2つの方法があった：</p>
<ul>
<li><p><strong>JSONの各フィールドを固定スキーマに事前定義し、インデックスを構築する：</strong>このアプローチは、確かなクエリパフォーマンスを実現するが、硬直的である。データフォーマットが変更されると、新しいフィールドや変更されたフィールドがあるたびに、手間のかかるデータ定義言語（DDL）の更新やスキーマの移行が繰り返されます。</p></li>
<li><p><strong>JSONオブジェクト全体を1つのカラムとして格納する（MilvusのJSONタイプとDynamic Schemaの両方がこのアプローチを採用しています）：</strong>このオプションは優れた柔軟性を提供しますが、クエリのパフォーマンスが犠牲になります。各リクエストは実行時にJSONを解析し、多くの場合テーブルをフルスキャンする必要があるため、データセットが大きくなるにつれて待ち時間が急増します。</p></li>
</ul>
<p>以前は、柔軟性とパフォーマンスのジレンマでした。</p>
<p><a href="https://milvus.io/">Milvusに</a>新しく導入されたJSONシュレッダー機能を使えば、もうそんなことはありません。</p>
<p><a href="https://milvus.io/docs/json-shredding.md">JSON Shreddingの</a>導入により、Milvusはスキーマフリーの俊敏性とカラム型ストレージのパフォーマンスを実現し、大規模な半構造化データを柔軟かつクエリフレンドリーにします。</p>
<h2 id="How-JSON-Shredding-Works" class="common-anchor-header">JSONシュレッディングの仕組み<button data-href="#How-JSON-Shredding-Works" class="anchor-icon" translate="no">
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
    </button></h2><p>JSONシュレッダーは、行ベースのJSONドキュメントを高度に最適化されたカラム型ストレージに変換することで、JSONクエリを高速化します。Milvusは、データモデリングにおけるJSONの柔軟性を維持しながら、カラム型ストレージを自動的に最適化することで、データアクセスとクエリのパフォーマンスを大幅に向上させます。</p>
<p>疎なJSONフィールドや希少なJSONフィールドを効率的に処理するために、Milvusは共有キーのための転置インデックスも備えている。JSONドキュメントの挿入は通常通り行い、Milvusが最適なストレージとインデックスを内部で管理します。</p>
<p>Milvusは、様々な形状や構造を持つ生のJSONレコードを受信すると、各JSONキーの出現率と型の安定性（データ型が文書間で一貫しているか）を分析します。この分析に基づいて、各キーは3つのカテゴリのいずれかに分類されます：</p>
<ul>
<li><p><strong>タイプされたキー：</strong>ほとんどのドキュメントに出現し、常に同じデータ型を持つキー（例：すべての整数またはすべての文字列）。</p></li>
<li><p><strong>動的キー</strong>：頻繁に現れるがデータ型がまちまちなキー（例：文字列のときもあれば整数のときもある）。</p></li>
<li><p><strong>共有キー：</strong>頻度が低く、まばらで、入れ子になっており、設定可能な頻度のしきい値を下回っているキー。</p></li>
</ul>
<p>Milvusは効率を最大化するため、各カテゴリーを異なる方法で処理する：</p>
<ul>
<li><p><strong>型付きキーは</strong>専用の強い型付きカラムに格納される。</p></li>
<li><p><strong>動的キーは</strong>、実行時に観測される実際の値型に基づいて動的カラムに配置される。</p></li>
<li><p>型付きカラムと動的カラムの両方がArrow/Parquetカラム形式で格納され、高速スキャンと高度に最適化されたクエリ実行を実現する。</p></li>
<li><p><strong>共有キーは</strong>コンパクトなバイナリJSONカラムに統合され、共有キーの転置インデックスを伴う。このインデックスは、無関係な行を早期に刈り込み、クエリされたキーを含む文書のみに検索を制限することで、低頻度フィールドに対するクエリを高速化する。</p></li>
</ul>
<p>このアダプティブカラム型ストレージと転置インデックスの組み合わせが、MilvusのJSONシュレッディングメカニズムの中核を成しており、柔軟性と高性能の両立を可能にしている。</p>
<p>全体的なワークフローを以下に示す：</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/json_shredding_79a62a9661.PNG" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>JSONシュレッダーの仕組みの基本を説明したところで、このアプローチを柔軟かつ高性能にする主要な機能を詳しく見ていきましょう。</p>
<h3 id="Shredding-and-Columnarization" class="common-anchor-header">シュレッダーと列化</h3><p>新しいJSONドキュメントが書き込まれると、Milvusはそれを分解し、最適化されたカラム型ストレージに再編成します：</p>
<ul>
<li><p>型付きキーと動的キーは自動的に識別され、専用のカラムに格納されます。</p></li>
<li><p>JSONにネストされたオブジェクトが含まれている場合、Milvusはパスベースのカラム名を自動的に生成します。例えば、<code translate="no">user</code> オブジェクト内の<code translate="no">name</code> フィールドは、<code translate="no">/user/name</code> というカラム名で格納されます。</p></li>
<li><p>共有キーは1つのコンパクトなバイナリJSONカラムにまとめて格納されます。これらのキーは頻繁に出現しないため、Milvusはこれらのキーのための転置インデックスを構築し、高速なフィルタリングを可能にし、システムが指定されたキーを含む行を素早く見つけることを可能にします。</p></li>
</ul>
<h3 id="Intelligent-Column-Management" class="common-anchor-header">インテリジェントなカラム管理</h3><p>Milvusは、JSONをカラムに細断するだけでなく、動的なカラム管理によってインテリジェンスを追加し、JSON細断がデータの進化に柔軟に対応できるようにします。</p>
<ul>
<li><p><strong>カラムは必要に応じて作成されます：</strong>新しいキーがJSONドキュメントに現れると、Milvusは自動的に同じキーを持つ値を専用のカラムにグループ化します。これにより、ユーザが前もってスキーマを設計することなく、カラム型ストレージのパフォーマンス上の利点を維持することができます。また、Milvusは新しいフィールドのデータ型（INTEGER、DOUBLE、VARCHARなど）を推測し、効率的なカラム形式を選択します。</p></li>
<li><p><strong>すべてのキーは自動的に処理されます：</strong>MilvusはJSONドキュメント内のすべてのキーを分析し、処理します。これにより、フィールドの事前定義やインデックスの構築をユーザーに強いることなく、幅広いクエリをカバーすることができます。</p></li>
</ul>
<h3 id="Query-Optimization" class="common-anchor-header">クエリの最適化</h3><p>データが適切なカラムに再編成されると、Milvusは各クエリに対して最も効率的な実行パスを選択します：</p>
<ul>
<li><p><strong>型付きキーと動的キーのダイレクトカラムスキャン：</strong>既にカラムに分割されているフィールドを対象とするクエリの場合、Milvusはそのカラムを直接スキャンすることができます。これにより、処理する必要があるデータの総量が削減され、SIMDアクセラレーションによるカラム計算を活用することで、さらに高速な実行が可能になります。</p></li>
<li><p><strong>共有キーのインデックス検索：</strong>Milvusは、クエリがそれ自身のカラムに昇格されなかったフィールド（通常、稀なキー）を含む場合、共有キーのカラムに対してそのクエリを評価します。このカラムに構築された転置インデックスにより、milvusは指定されたキーを含む行を素早く特定し、残りの行をスキップすることができる。</p></li>
<li><p><strong>自動メタデータ管理：</strong>Milvusはグローバルなメタデータと辞書を継続的に管理するため、入力されるJSONドキュメントの構造が時間とともに変化しても、クエリは正確で効率的な状態を維持します。</p></li>
</ul>
<h2 id="Performance-benchmarks" class="common-anchor-header">パフォーマンスベンチマーク<button data-href="#Performance-benchmarks" class="anchor-icon" translate="no">
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
    </button></h2><p>JSONドキュメント全体を単一のrawフィールドとして保存した場合と、新しくリリースされたJSONシュレッダー機能を使用した場合のクエリパフォーマンスを比較するベンチマークを設計しました。</p>
<h3 id="Test-environment-and-methodology" class="common-anchor-header">テスト環境と方法</h3><ul>
<li><p>ハードウェア：1コア/8GBクラスタ</p></li>
<li><p>データセット<a href="https://github.com/ClickHouse/JSONBench.git">JSONBenchからの</a>100万ドキュメント</p></li>
<li><p>方法論異なるクエリパターンでQPSとレイテンシを測定</p></li>
</ul>
<h3 id="Results-typed-keys" class="common-anchor-header">結果：タイプされたキー</h3><p>このテストでは、ほとんどのドキュメントに存在するキーをクエリしたときのパフォーマンスを測定した。</p>
<table>
<thead>
<tr><th>クエリー表現</th><th>QPS（シュレッダーなし）</th><th>QPS（シュレッダーあり）</th><th>パフォーマンス向上</th></tr>
</thead>
<tbody>
<tr><td>json['time_us'] &gt; 0</td><td>8.69</td><td>287.5</td><td><strong>33x</strong></td></tr>
<tr><td>json['kind'] == 'コミット'</td><td>8.42</td><td>126.1</td><td><strong>14.9x</strong></td></tr>
</tbody>
</table>
<h3 id="Results-shared-keys" class="common-anchor-header">結果：共有キー</h3><p>このテストでは、"共有 "カテゴリーに分類される、ネストされた疎なキーのクエリに焦点を当てました。</p>
<table>
<thead>
<tr><th>クエリ式</th><th>QPS（シュレッダーなし）</th><th>QPS（シュレッダーあり）</th><th>パフォーマンス向上</th></tr>
</thead>
<tbody>
<tr><td>json['identity']['seq'] &gt; 0</td><td>4.33</td><td>385</td><td><strong>88.9x</strong></td></tr>
<tr><td>json['identity']['did'] == 'xxxxx'</td><td>7.6</td><td>352</td><td><strong>46.3x</strong></td></tr>
</tbody>
</table>
<p>共有キーのクエリは最も劇的な改善（最大89倍高速化）を示し、型付きキーのクエリは一貫して15～30倍の高速化を実現しています。全体的に、JSON Shreddingはすべてのクエリタイプで恩恵を受け、全体的にパフォーマンスが向上しています。</p>
<h2 id="Try-It-Now" class="common-anchor-header">今すぐ試す<button data-href="#Try-It-Now" class="anchor-icon" translate="no">
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
    </button></h2><p>APIログ、IoTセンサーデータ、急速に進化するアプリケーションのペイロードのいずれを扱う場合でも、JSON Shreddingは、柔軟性と高いパフォーマンスの両方を実現する稀有な能力を提供します。</p>
<p>この機能は現在利用可能です。詳細は<a href="https://milvus.io/docs/json-shredding.md">こちらのドキュメントを</a>ご覧ください。</p>
<p>Milvusの最新機能について、ご質問やディープダイブをご希望ですか？私たちの<a href="https://discord.com/invite/8uyFbECzPX"> Discordチャンネルに</a>参加するか、<a href="https://github.com/milvus-io/milvus"> GitHubに</a>課題を提出してください。また、<a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md"> Milvusオフィスアワーを通して</a>、20分間の1対1のセッションを予約し、洞察やガイダンス、質問への回答を得ることもできます。</p>
<p>さらに詳しく知りたい方は、Milvus Weekシリーズを通してさらに深く掘り下げていきますので、ご期待ください。</p>
