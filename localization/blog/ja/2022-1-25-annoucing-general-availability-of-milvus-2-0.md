---
id: 2022-1-25-annoucing-general-availability-of-milvus-2-0.md
title: Milvus 2.0一般提供開始のお知らせ
author: Xiaofan Luan
date: 2022-01-25T00:00:00.000Z
desc: 膨大な高次元データを簡単に扱う方法
cover: assets.zilliz.com/Milvus_2_0_GA_4308a0f552.png
tag: News
---
<p>Milvusコミュニティのメンバーおよび友人の皆様：</p>
<p>最初のリリース候補(RC)が公開されてから6ヶ月が経過した本日、Milvus 2.0が<a href="https://milvus.io/docs/v2.0.x/release_notes.md#v200">一般公開(GA)さ</a>れ、本番稼動が可能となったことを発表できることを嬉しく思います！コミュニティへの貢献者、ユーザー、そしてLF AI &amp; Data Foundationの皆様をはじめ、多くの方々のご協力に感謝いたします。</p>
<p>何十億もの高次元データを処理する能力は、最近のAIシステムにとって大きな課題であり、それには十分な理由がある：</p>
<ol>
<li>非構造化データは、従来の構造化データと比較して圧倒的なボリュームを占めている。</li>
<li>データの鮮度がかつてないほど重要になっているのだ。データ・サイエンティストは、従来のT+1の妥協ではなく、タイムリーなデータ・ソリューションを切望している。</li>
<li>Cost and performance have become even more critical, and yet there still exists a big gap between current solutions and real world use cases.
Hence, Milvus 2.0.Milvusは、高次元データを大規模に扱うためのデータベースである。クラウド用に設計されており、あらゆる場所で実行できる。MilvusのRCリリースをご覧になっている方は、Milvusをより安定させ、デプロイと保守を容易にするために多大な労力を費やしてきたことをご存知でしょう。</li>
</ol>
<h2 id="Milvus-20-GA-now-offers" class="common-anchor-header">Milvus 2.0 GAでは以下の機能が追加されました。<button data-href="#Milvus-20-GA-now-offers" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>エンティティ削除</strong></p>
<p>データベースとして、Milvusは<a href="https://milvus.io/docs/v2.0.x/delete_data.md">プライマリキーによるエンティティの削除を</a>サポートするようになりました。</p>
<p><strong>自動ロードバランス</strong></p>
<p>Milvusは、各クエリノードとデータノードの負荷をバランスさせるプラグインロードバランスポリシーをサポートするようになりました。計算とストレージの分離により、バランスは数分で完了します。</p>
<p><strong>ハンドオフ</strong></p>
<p>成長中のセグメントがフラッシュによって封印されると、ハンドオフタスクは成長中のセグメントをインデックス化された過去のセグメントと置き換え、検索パフォーマンスを向上させます。</p>
<p><strong>データコンパクション</strong></p>
<p>データコンパクションは、小さなセグメントを大きなセグメントにマージし、論理的に削除されたデータをクリーンアップするバックグラウンドタスクである。</p>
<p><strong>組み込みetcdとローカルデータストレージのサポート</strong></p>
<p>Milvusのスタンドアロンモードでは、わずかな設定でetcd/MinIOの依存性を取り除くことができる。ローカルデータストレージは、メインメモリへの全データのロードを回避するローカルキャッシュとしても使用できます。</p>
<p><strong>多言語SDK</strong></p>
<p><a href="https://github.com/milvus-io/pymilvus">PyMilvusに加えて</a>、<a href="https://github.com/milvus-io/milvus-sdk-node">Node.js</a>、<a href="https://github.com/milvus-io/milvus-sdk-java">Java</a>、<a href="https://github.com/milvus-io/milvus-sdk-go">Goの</a>SDKがすぐに使えるようになりました。</p>
<p><strong>Milvus K8s Operator</strong></p>
<p><a href="https://milvus.io/docs/v2.0.x/install_cluster-milvusoperator.md">Milvus Operatorは</a>、Milvusコンポーネントと関連する依存関係（etcd、Pulsar、MinIOなど）の両方を含む完全なMilvusサービススタックを、スケーラブルで可用性の高い方法でターゲットの<a href="https://kubernetes.io/">Kubernetes</a>クラスタにデプロイして管理するための簡単なソリューションを提供します。</p>
<p><strong>Milvusの管理に役立つツール</strong></p>
<p>管理ツールの素晴らしい貢献には<a href="https://zilliz.com/">Zilliz氏に</a>感謝している。直感的なGUIでMilvusを操作できる<a href="https://milvus.io/docs/v2.0.x/attu.md">Attuと</a>、Milvusを管理するためのコマンドラインツール<a href="https://milvus.io/docs/v2.0.x/cli_overview.md">Milvus_CLI</a>です。</p>
<p>212人の貢献者のおかげで、コミュニティは過去6ヶ月間に6718のコミットを完了し、大量の安定性とパフォーマンスに関する問題が解決されました。2.0のGAリリース後、すぐに安定性とパフォーマンスのベンチマークレポートを公開する予定です。</p>
<h2 id="Whats-next" class="common-anchor-header">次は何ですか？<button data-href="#Whats-next" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>機能性</strong></p>
<p>文字列型のサポートはmilvus 2.1の次のキラー機能です。また、TTL(time to live)メカニズムや基本的なACL管理も導入し、ユーザーのニーズをより満足させる予定です。</p>
<p><strong>可用性</strong></p>
<p>各セグメントでマルチメモリレプリカをサポートするため、クエリコーデックスケジューリングメカニズムのリファクタリングに取り組んでいます。複数のアクティブレプリカにより、Milvusはより高速なフェイルオーバーと投機的実行をサポートし、ダウンタイムを数秒以内に短縮することができます。</p>
<p><strong>パフォーマンス</strong></p>
<p>パフォーマンスベンチマークの結果は、近日中に弊社ウェブサイトで公開される予定です。次のリリースでは、目覚ましいパフォーマンスの向上が期待されます。私たちの目標は、より小さなデータセットでの検索レイテンシーを半減し、システム・スループットを2倍にすることです。</p>
<p><strong>使いやすさ</strong></p>
<p>Milvusはどこでも動作するように設計されています。MilvusはMacOS(M1とX86の両方)とARMサーバー上で動作し、今後数回のリリースでサポートされる予定です。また、組み込みPyMilvusも提供する予定です。これにより、複雑な環境設定をすることなく、<code translate="no">pip install</code> 。</p>
<p><strong>コミュニティガバナンス</strong></p>
<p>メンバールールを洗練し、貢献者の役割の要件と責任を明確にします。クラウドネイティブなデータベース、ベクトル検索、コミュニティガバナンスに興味のある方は、お気軽にご連絡ください。</p>
<p>Milvus GAの最新リリースにとても興奮しています！いつも通り、皆様からのフィードバックをお待ちしております。何か問題がありましたら、遠慮なく<a href="https://github.com/milvus-io/milvus">GitHub</a>または<a href="http://milvusio.slack.com/">Slackで</a>ご連絡ください。</p>
<p><br/></p>
<p>よろしくお願いします、</p>
<p>シャオファン・ルアン</p>
<p>Milvusプロジェクト・メインテナー</p>
<p><br/></p>
<blockquote>
<p><em>編集者：<a href="https://github.com/claireyuw">Claire Yu</a>.</em></p>
</blockquote>
