---
id: 2022-01-07-year-in-review.md
title: 2021年のmilvus - 振り返りの年
author: Xiaofan Luan
date: 2022-01-07T00:00:00.000Z
desc: Milvusコミュニティがこれまでに成し遂げてきたこと、そして2022年に向けての展望をご紹介します。
cover: assets.zilliz.com/Year_in_review_6deaee3a96.png
tag: Events
---
<p>2021年は、オープンソースプロジェクトとしてのMilvusにとって素晴らしい年となりました。このような素晴らしい年に貢献してくれたMilvusのすべての貢献者、ユーザー、そしてパートナーにこの場を借りてお礼を申し上げたい。</p>
<p><strong>私にとって今年最も印象的な出来事のひとつは、Milvus 2.0のリリースです。このプロジェクトを開始する前、私たちが世界で最も先進的なベクターデータベースを提供できると信じていたコミュニティメンバーはごく少数でしたが、今、Milvus 2.0 GAがプロダクションレディになったことを誇りに思います。</strong></p>
<p>私たちはすでに2022年に向けて新たなエキサイティングな課題に取り組んでいますが、昨年私たちが踏み出した大きなステップのいくつかを祝うのは楽しいことだと思いました。いくつか紹介しよう：</p>
<h2 id="Community-Growth" class="common-anchor-header">コミュニティの成長<button data-href="#Community-Growth" class="anchor-icon" translate="no">
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
    </button></h2><p>まず、GitHubとSlackのコミュニティ統計のまとめです。2021年12月末までに</p>
<ul>
<li><p><strong>貢献者は</strong>2020年12月の121人から2021年12月には209人に増加（172％増）</p></li>
<li><p><strong>スターは</strong>2020年12月の4828から2021年12月には9090に増加（188％増）</p></li>
<li><p><strong>フォークは</strong>2020年12月の756人から2021年12月には1383人に増加（182％増）</p></li>
<li><p><strong>Slackメンバーは</strong>2020年12月の541人から2021年12月の1233人に増加（227％増）</p></li>
</ul>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1_1_e94deb087f.png" alt="img" class="doc-image" id="img" />
   </span> <span class="img-wrapper"> <span>イメージ</span> </span></p>
<h2 id="Community-Governance-and-Advocacy" class="common-anchor-header">コミュニティ・ガバナンスとアドボカシー<button data-href="#Community-Governance-and-Advocacy" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvusが2019年10月に初めてオープンソースになったとき、私たちは比較的小さなチームと小さなコミュニティを持っていたので、当然、プロジェクトは主に数人のコアチームメンバーによって統治されていました。しかし、その後コミュニティが大きく成長したため、新しい貢献者をより効率的に迎えることができるよう、プロジェクトを運営するためのより良いシステムが必要であることに気づきました。</p>
<p>その結果、私たちは2021年に5人の新しいメンテナを任命し、進行中の作業と報告された問題を追跡して、タイムリーにレビューとマージが行われるようにしました。5人のメンテナーのGitHub IDは、@xiaofan-luan; @congqixia; @scsven; @czs007; @yanliang567です。PRで助けが必要な場合は、遠慮なくこれらのメンテナに連絡してください。</p>
<p>また、<a href="https://milvus.io/community/milvus_advocate.md">Milvus Advocate Programを</a>立ち上げました。あなたの経験を共有し、コミュニティメンバーに援助を提供し、見返りに評価を得るために、より多くの方の参加をお待ちしています。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1_2_835f379fb0.png" alt="img" class="doc-image" id="img" />
   </span> <span class="img-wrapper"> <span>イメージ</span> </span></p>
<p>(Image: Milvus GitHub contributors, dynamicwebpaigeの<a href="https://github.com/dynamicwebpaige/nanowrimo-2021/blob/main/15_VS_Code_contributors.ipynb">プロジェクトで</a>作成 )</p>
<h2 id="Milvus-Project-Announcements-and-Milestones" class="common-anchor-header">Milvusプロジェクトからのお知らせとマイルストーン<button data-href="#Milvus-Project-Announcements-and-Milestones" class="anchor-icon" translate="no">
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
    </button></h2><ol>
<li><strong>バージョンリリース数：14</strong></li>
</ol>
<ul>
<li><a href="https://milvus.io/blog/Whats-Inside-Milvus-1.0.md">Milvus 1.0 リリース</a></li>
<li><a href="https://milvus.io/blog/milvus2.0-redefining-vector-database.md">Milvus 2.0 RCリリース</a></li>
<li><a href="https://milvus.io/docs/v2.0.x/release_notes.md#v200-PreGA">Milvus2.0リリースPreGA</a></li>
</ul>
<ol>
<li><strong>Milvus v2.0.0 GA対応SDK</strong></li>
</ol>
<ul>
<li><p>PyMilvus (利用可能)</p></li>
<li><p>Go SDK (利用可能)</p></li>
<li><p>Java SDK (利用可能)</p></li>
<li><p>Node.js SDK（利用可能）</p></li>
<li><p>C++ SDK (開発中)</p></li>
</ul>
<ol start="3">
<li><strong>Milvus新ツール提供開始</strong></li>
</ol>
<ul>
<li><a href="https://github.com/zilliztech/milvus_cli#community">Milvus_CLI</a>(Milvus コマンドライン)</li>
<li><a href="https://github.com/zilliztech/attu">Attu</a>(Milvus管理GUI)</li>
<li><a href="https://github.com/milvus-io/milvus-operator">Milvus K8s オペレータ</a></li>
</ul>
<ol start="4">
<li><p><strong><a href="https://lfaidata.foundation/blog/2021/06/23/lf-ai-data-foundation-announces-graduation-of-milvus-project/">MilvusはLF AI &amp; Data Foundationの卒業プロジェクトとなりました。</a></strong></p></li>
<li><p><strong><a href="https://www.cs.purdue.edu/homes/csjgwang/pubs/SIGMOD21_Milvus.pdf">Milvus: A Purpose-Built Vector Data Management SystemがSIGMOD'2021に掲載されました。）</a></strong></p></li>
<li><p><strong><a href="https://discuss.milvus.io/">Milvusコミュニティフォーラムを立ち上げました。</a></strong></p></li>
</ol>
<h2 id="Community-Events" class="common-anchor-header">コミュニティイベント<button data-href="#Community-Events" class="anchor-icon" translate="no">
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
    </button></h2><p>現在のCovid-19の状況にもかかわらず、私たちのグローバルなコミュニティメンバーが（主にバーチャルで）会うことができるように、今年も多くのイベントを主催し、参加しました。合計で21のカンファレンスに参加し、ホストを務めました：</p>
<ul>
<li>6 技術ミーティング</li>
<li>7 Milvusオフィスアワー</li>
<li>34 ウェビナー</li>
<li>3 オフラインミートアップ</li>
</ul>
<p>2022年にはさらに多くのイベントを計画しています。お近くで開催されるイベントに参加されたい方は、コミュニティフォーラムの「<a href="https://discuss.milvus.io/c/events-and-meetups/13">イベントとミートアップ</a>」カテゴリーで、今後のイベントと開催場所をご確認ください。今後のイベントのスピーカーやホストをご希望の方は、<a href="mailto:community@milvus.io">community@milvus.io</a> までご連絡ください。</p>
<h2 id="Looking-Ahead-to-2022--Roadmap--Announcement" class="common-anchor-header">2022年に向けて-ロードマップとお知らせ<button data-href="#Looking-Ahead-to-2022--Roadmap--Announcement" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>コミュニティ</strong></p>
<ol>
<li>Milvusプロジェクトメンバーシップを向上させ、より多くのメンテナやコミッタを集め、選出し、一緒にコミュニティを作り上げていく。</li>
<li>メンターシッププログラムを立ち上げ、コミュニティに参加し貢献したいと考える新参者をより多く支援する。</li>
<li><strong>技術文書、ユーザーガイド、コミュニティ文書を</strong>含む、コミュニティ文書のガバナンスを改善する。2022年には、コミュニティメンバーが一緒にMilvusハンドブックを完成させ、人々がMilvusのより良い使い方を学ぶことができるようになることを願っています。</li>
<li>上流のAIコミュニティや、Milvusが依存しているKubernetes、MinIO、etcd、Pulsarなどのコミュニティを含む、他のオープンソースコミュニティとの協力と交流を強化する。</li>
<li>SIGミーティングをより定期的に開催することで、よりコミュニティ主導型になる。現在運営されているsig-pymilvusの他に、2022年にはもっと多くのSIGを持つ予定です。</li>
</ol>
<p><strong>Milvusプロジェクト：</strong></p>
<ol>
<li>パフォーマンス・チューニング</li>
</ol>
<p>Milvusが選ばれる理由として、優れたパフォーマンスは常に重要な要素です。2022年にはパフォーマンス最適化プロジェクトを開始し、スループットと遅延を2倍以上向上させる予定です。また、メモリレプリカを導入し、スループットと小規模データセットでのシステムの安定性を向上させ、GPUをサポートし、インデックス構築とオンラインサービスを高速化する予定です。</p>
<ol start="2">
<li>機能性</li>
</ol>
<p>Milvus2.0では、既にベクトル/スカラーハイブリッド検索、エンティティ削除、タイムトラベルなどの機能をサポートしている。次の2つのメジャーリリースでは以下の機能をサポートする予定です：</p>
<ul>
<li>より豊富なデータ型のサポート：文字列、ブロブ、地理空間など。</li>
<li>ロールベースのアクセス制御</li>
<li>主キーの重複排除</li>
<li>ベクトルでの範囲検索のサポート（距離&lt;0.8の検索）</li>
<li>レストフルAPIのサポート、およびその他の言語SDK</li>
</ul>
<ol start="3">
<li>使いやすさ</li>
</ol>
<p>来年には、Milvusの導入と管理を支援するツールを開発する予定です。</p>
<ul>
<li><p>Milvus up：  K8sクラスタのないオフライン環境でMilvusを立ち上げるためのデプロイコンポーネント。また、モニタリング、トレース、その他Milvusの開発にも役立ちます。</p></li>
<li><p>Attu - クラスタ管理システムAttuの改良を続けます。健康診断やインデックスの最適化などの機能を追加する予定です。</p></li>
<li><p>Milvus DM: 他のデータベースやファイルからMilvusへベクターを移行するためのデータ移行ツールです。まずはFAISS、HNSW、Milvus 1.0/2.0をサポートし、その後MySQLやElasticsearchなど他のデータベースもサポートする予定です。</p></li>
</ul>
<h2 id="About-the-author" class="common-anchor-header">作者について<button data-href="#About-the-author" class="anchor-icon" translate="no">
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
    </button></h2><p>Xiaofan Luan、Zillizのパートナー兼エンジニアリング・ディレクター、LF AI &amp; Data Foundationの技術諮問委員会メンバー。オラクル米国本社、Software Defined Storageの新興企業Hedvigを歴任。Alibaba Cloud Databaseチームに参加し、NoSQLデータベースHBaseとLindormの開発を担当。コーネル大学で電子コンピューター工学の修士号を取得。</p>
