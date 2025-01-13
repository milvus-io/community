---
id: 2021-10-22-apply-configuration-changes-on-milvus-2.md
title: '技術共有:Docker Composeを使ってMilvus 2.0の設定変更を適用する'
author: Jingjing
date: 2021-10-22T00:00:00.000Z
desc: Milvus 2.0での設定変更の適用方法について説明します。
cover: assets.zilliz.com/Modify_configurations_f9162c5670.png
tag: Engineering
---
<custom-h1>技術共有：Docker Composeを使ったMilvus 2.0の設定変更の適用</custom-h1><p><em>ZillizデータエンジニアのJingjing Jiaは、西安交通大学でコンピュータサイエンスの学位を取得。Zilliz入社後は、主にデータの前処理、AIモデルのデプロイ、Milvus関連技術の研究、コミュニティユーザーのアプリケーションシナリオの実装支援に従事。忍耐強く、コミュニティパートナーとのコミュニケーションを好み、趣味は音楽鑑賞とアニメ鑑賞。</em></p>
<p>Milvusを頻繁に利用している私は、新しくリリースされたMilvus 2.0 RCにとても興奮した。公式サイトの紹介によると、Milvus 2.0は前作を大きく上回っているようだ。自分で試してみたくなった。</p>
<p>そして試した。  しかし、いざMilvus 2.0を手にしてみると、Milvus 2.0ではMilvus 1.1.1の時のように簡単に設定ファイルを変更することができないことに気がついた。Docker Composeで起動したMilvus 2.0のDockerコンテナ内で設定ファイルを変更することができず、強制的に変更しても反映されませんでした。その後、Milvus 2.0 RCはインストール後の設定ファイルの変更を検出できないことがわかりました。今後の安定版リリースでは、この問題が修正される予定だ。</p>
<p>様々なアプローチを試した結果、Milvus 2.0のスタンドアロンとクラスタに設定ファイルの変更を適用する確実な方法を見つけました。</p>
<p>Docker Composeを使用してMilvusを再起動する前に、すべての設定変更を行う必要があることに注意してください。</p>
<h2 id="Modify-configuration-file-in-Milvus-standalone" class="common-anchor-header">Milvusスタンドアロンの設定ファイルの変更<button data-href="#Modify-configuration-file-in-Milvus-standalone" class="anchor-icon" translate="no">
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
    </button></h2><p>まず、<strong>milvus.yaml</strong>ファイルのコピーをローカルデバイスに<a href="https://github.com/milvus-io/milvus/blob/master/configs/milvus.yaml">ダウンロード</a>する必要があります。</p>
<p>その後、ファイル内の設定を変更します。例えば、ログのフォーマットを<code translate="no">.json</code>.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1_1_ee4a16a3ee.png" alt="1.1.png" class="doc-image" id="1.1.png" />
   </span> <span class="img-wrapper"> <span>1.1.png</span> </span></p>
<p><strong>milvus.yaml</strong>ファイルを変更したら、スタンドアロン用の<strong>docker-compose.yaml</strong>ファイルも<a href="https://github.com/milvus-io/milvus/blob/master/deployments/docker/standalone/docker-compose.yml">ダウンロードして</a>変更する必要があります。milvus.yamlへのローカルパスを、対応するdockerコンテナのパスと設定ファイル<code translate="no">volumes</code> セクションの下にある<code translate="no">/milvus/configs/milvus.yaml</code> にマッピングします。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1_2_5e7c73708c.png" alt="1.2.png" class="doc-image" id="1.2.png" />
   </span> <span class="img-wrapper"> <span>1.2.png</span> </span></p>
<p>最後に、<code translate="no">docker-compose up -d</code> を使って Milvus standalone を起動し、変更が成功したかどうかを確認します。例えば、<code translate="no">docker logs</code> を実行してログのフォーマットを確認してください。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1_3_a0406df3ab.png" alt="1.3.png" class="doc-image" id="1.3.png" />
   </span> <span class="img-wrapper"> <span>1.3.png</span> </span></p>
<h2 id="Modify-configuration-file-in-Milvus-cluster" class="common-anchor-header">Milvusクラスタの設定ファイルの修正<button data-href="#Modify-configuration-file-in-Milvus-cluster" class="anchor-icon" translate="no">
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
    </button></h2><p>まず、<strong>milvus.yaml</strong>ファイルを<a href="https://github.com/milvus-io/milvus/blob/master/configs/milvus.yaml">ダウンロード</a>し、必要に応じて変更します。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1_4_758b182846.png" alt="1.4.png" class="doc-image" id="1.4.png" />
   </span> <span class="img-wrapper"> <span>1.4.png</span> </span></p>
<p>次に、クラスタの<strong>docker-compose.yml</strong>ファイルを<a href="https://github.com/milvus-io/milvus/blob/master/deployments/docker/cluster/docker-compose.yml">ダウンロードして</a>修正します。<strong>milvus.yamlの</strong>ローカルパスを、すべてのコンポーネント（ルートコーデック、データコーデック、データノード、クエリコーデック、クエリノード、インデックスコーデック、インデックスノード、プロキシ）の設定ファイルの対応するパスにマッピングします。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1_5_80e15811b8.png" alt="1.5.png" class="doc-image" id="1.5.png" />
   </span> <span class="img-wrapper"> <span>1.5.png</span> </span></p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1_6_b2f3e4e47f.png" alt="1.6.png" class="doc-image" id="1.6.png" />
   </span> <span class="img-wrapper"> <span>1.6.png</span> </span> <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1_7_4d1eb5e1e5.png" alt="1.7.png" class="doc-image" id="1.7.png" /></span> <span class="img-wrapper">1 </span>.<span class="img-wrapper">7<span>.png</span> </span></p>
<p>最後に、Milvusクラスタを<code translate="no">docker-compose up -d</code> 。</p>
<h2 id="Change-log-file-path-in-configuration-file" class="common-anchor-header">設定ファイルのログファイルパスの変更<button data-href="#Change-log-file-path-in-configuration-file" class="anchor-icon" translate="no">
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
    </button></h2><p>まず、<strong>milvus.yaml</strong>ファイルを<a href="https://github.com/milvus-io/milvus/blob/master/configs/milvus.yaml">ダウンロード</a>し、<code translate="no">rootPath</code> セクションをDockerコンテナ内のログファイルを保存するディレクトリに変更します。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1_8_e3bdc4843f.png" alt="1.8.png" class="doc-image" id="1.8.png" />
   </span> <span class="img-wrapper"> <span>1.8.png</span> </span></p>
<p>その後、Milvus<a href="https://github.com/milvus-io/milvus/blob/master/deployments/docker/standalone/docker-compose.yml">スタンドアロン</a>または<a href="https://github.com/milvus-io/milvus/blob/master/deployments/docker/cluster/docker-compose.yml">クラスタに</a>対応する<strong>docker-compose.yml</strong>ファイルをダウンロードする。</p>
<p>スタンドアロンの場合は、ローカルの<strong>milvus.yamlへの</strong>パスを対応するDockerコンテナの設定ファイルへのパス<code translate="no">/milvus/configs/milvus.yaml</code> にマッピングし、ローカルのログファイルディレクトリを先に作成したDockerコンテナのディレクトリにマッピングする必要があります。</p>
<p>クラスタの場合は、すべてのコンポーネントで両方のパスをマップする必要があります。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1_9_22d8929d92.png" alt="1.9.png" class="doc-image" id="1.9.png" />
   </span> <span class="img-wrapper"> <span>1.9.png</span> </span></p>
<p>最後に、Milvusスタンドアロンまたはクラスタを<code translate="no">docker-compose up -d</code> 。</p>
