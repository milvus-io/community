---
id: power-high-performance-rag-for-genai-with-hpe-alletra-storag-mp-milvus.md
title: HPE Alletra Storage MP + MilvusでGenAI向け高性能RAGを強化
author: Denise Ochoa-Mendoza
date: 2025-11-10T00:00:00.000Z
cover: assets.zilliz.com/hpe_cover_45b4796ef3.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Milvus, HPE, Alletra Storage MP X10000, vector database, RAG'
meta_title: Optimized RAG with HPE Alletra Storage MP X10000 + Milvus
desc: >-
  HPE Alletra Storage MP
  X10000とmilvusでGenAIを強化。スケーラブルで低レイテンシのベクトル検索とエンタープライズグレードのストレージで、高速で安全なRAGを実現します。
origin: >-
  https://community.hpe.com/t5/around-the-storage-block/power-high-performance-rag-for-genai-with-hpe-alletra-storage-mp/ba-p/7257369
---
<p>HPE Alletra Storage MP X10000とMilvusは、スケーラブルで低レイテンシーのRAGを実現し、LLMがGenAIワークロード向けに高性能なベクトル検索で正確でコンテキストリッチな応答を提供できるようにします。</p>
<h2 id="In-generative-AI-RAG-needs-more-than-just-an-LLM" class="common-anchor-header">ジェネレーティブAIでは、RAGはLLM以上のものを必要とします。<button data-href="#In-generative-AI-RAG-needs-more-than-just-an-LLM" class="anchor-icon" translate="no">
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
    </button></h2><p>コンテキストは、ジェネレーティブAI（GenAI）と大規模言語モデル（LLM）の真の力を解き放ちます。LLMがその応答を方向付ける適切なシグナルを持つとき、正確で、適切で、信頼できる回答を提供することができる。</p>
<p>例えば、GPS装置を持っているが衛星信号がない密林に落とされたとしよう。画面には地図が表示されるが、現在位置がわからなければナビゲーションとしては役に立たない。逆に、強力な衛星信号を持つGPSは、単に地図を表示するだけでなく、ターン・バイ・ターンで案内してくれる。</p>
<p>これがLLMの検索支援型生成（RAG）だ。モデルはすでに地図（事前に学習された知識）を持っているが、方向（あなたのドメイン固有のデータ）は持っていない。RAGのないLLMは、知識は満載だがリアルタイムの方向がわからないGPSデバイスのようなものだ。RAGは、モデルがどこにいてどこに行くべきかを伝える信号を提供する。</p>
<p>RAGは、ポリシー、製品ドキュメント、チケット、PDF、コード、音声トランスクリプト、画像など、独自のドメイン固有のコンテンツから引き出された、信頼できる最新の知識でモデルの応答を根拠づける。RAGを大規模に機能させることは困難です。検索プロセスは、ユーザーエクスペリエンスをシームレスに保つのに十分速く、最も関連性の高い情報を返すのに十分正確で、システムが高負荷状態にある場合でも予測可能である必要があります。これは、大量のクエリ、継続的なデータ取り込み、インデックス構築のようなバックグラウンドタスクを、パフォーマンスを低下させることなく処理することを意味します。数枚のPDFでRAGパイプラインをスピンアップするのは比較的簡単です。しかし、数百のPDFにスケールアップする場合は、かなり難しくなります。すべてをメモリ上に保持することはできませんので、埋め込み、インデックス、検索パフォーマンスを管理するために、堅牢で効率的なストレージ戦略が不可欠になります。RAGは、ベクターデータベースと、同時実行とデータ量の増加に対応できるストレージレイヤーを必要とします。</p>
<h2 id="Vector-databases-power-RAG" class="common-anchor-header">ベクトルデータベースがRAGを動かす<button data-href="#Vector-databases-power-RAG" class="anchor-icon" translate="no">
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
    </button></h2><p>RAGの核心はセマンティック検索であり、正確なキーワードではなく意味によって情報を見つけることである。そこで登場するのがベクトル・データベースである。ベクトルデータベースは、テキスト、画像、その他の非構造化データの高次元埋め込みデータを格納し、クエリに最も関連するコンテキストを検索する類似検索を可能にする。Milvusはその代表的な例であり、10億規模の類似検索のために構築されたクラウドネイティブのオープンソース・ベクターデータベースである。Milvusはハイブリッド検索をサポートし、ベクトル類似度とキーワードやスカラーフィルタを組み合わせて精度を高め、GPUを意識した最適化オプションで高速化を図りながら、コンピュートとストレージの独立したスケーリングを提供します。Milvusはまた、スマートセグメントライフサイクルによってデータを管理し、HNSWやDiskANNなどのコンパクションや複数の近似最近傍（ANN）インデックスオプションによって、成長セグメントから密封セグメントへと移行し、RAGのようなリアルタイムAIワークロードのパフォーマンスとスケーラビリティを確保します。</p>
<h2 id="The-hidden-challenge-Storage-throughput--latency" class="common-anchor-header">隠れた課題：ストレージのスループットとレイテンシ<button data-href="#The-hidden-challenge-Storage-throughput--latency" class="anchor-icon" translate="no">
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
    </button></h2><p>ベクトル検索ワークロードは、システムのあらゆる部分に負荷をかけます。これらのワークロードは、インタラクティブなクエリに対して低レイテンシの検索を維持しながら、高同時インジェストを要求します。同時に、インデックス構築、コンパクション、データ再ロードなどのバックグラウンド処理は、ライブパフォーマンスを中断することなく実行されなければなりません。従来のアーキテクチャにおけるパフォーマンスのボトルネックの多くは、ストレージに起因しています。入出力（I/O）の制限、メタデータ・ルックアップの遅延、同時実行の制約などです。予測可能なリアルタイムのパフォーマンスを大規模に提供するためには、ストレージレイヤーはベクトルデータベースの要求に対応しなければなりません。</p>
<h2 id="The-storage-foundation-for-high-performance-vector-search" class="common-anchor-header">高性能ベクトル検索のためのストレージ基盤<button data-href="#The-storage-foundation-for-high-performance-vector-search" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://www.hpe.com/in/en/alletra-storage-mp-x10000.html">HPE Alletra Storage MP X10000は</a>、フラッシュに最適化されたオールNVMeのS3互換オブジェクトストレージプラットフォームであり、規模に応じたリアルタイムパフォーマンスを実現するように設計されています。従来の容量重視のオブジェクトストアとは異なり、HPE Alletra Storage MP X10000は、ベクトル検索のような低レイテンシー、高スループットのワークロード向けに設計されています。ログ構造化されたキーバリューエンジンとエクステントベースのメタデータにより、高度に並列な読み取りと書き込みが可能になり、GPUDirect RDMAによりゼロコピーのデータパスが提供されるため、CPUのオーバーヘッドが削減され、GPUへのデータ移動が高速化されます。また、GPUDirect RDMAは、CPUのオーバーヘッドを削減し、GPUへのデータ移動を高速化するゼロコピーデータパスを提供します。このアーキテクチャは、容量とパフォーマンスを独立して成長させることができる分割スケーリングをサポートし、暗号化、ロールベースのアクセス制御（RBAC）、不変性、データ耐久性などのエンタープライズグレードの機能を備えています。HPE Alletra Storage MP X10000は、クラウドネイティブな設計と相まって、Kubernetes環境とシームレスに統合され、Milvus導入に理想的なストレージ基盤となります。</p>
<h2 id="HPE-Alletra-Storage-MP-X10000-and-Milvus-A-scalable-foundation-for-RAG" class="common-anchor-header">HPE Alletra Storage MP X10000とMilvus: RAGのスケーラブルな基盤<button data-href="#HPE-Alletra-Storage-MP-X10000-and-Milvus-A-scalable-foundation-for-RAG" class="anchor-icon" translate="no">
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
    </button></h2><p>HPE Alletra Storage MP X10000とMilvusは、互いに補完し合うことで、高速で予測可能、かつ拡張が容易なRAGを実現します。図1は、スケーラブルなAIユースケースとRAGパイプラインのアーキテクチャを示しており、コンテナ化された環境に展開されたMilvusコンポーネントが、HPE Alletra Storage MP X10000の高性能オブジェクトストレージとどのように相互作用するかを示している。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_1_Architecture_of_scalable_AI_use_cases_and_RAG_pipeline_using_HPE_Alletra_Storage_MP_X10000_and_Milvus_ed3a87a5ee.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Milvusはコンピュートとストレージを明確に分離し、HPE Alletra Storage MP X10000はベクトルワークロードに追従する高スループット、低レイテンシーのオブジェクトアクセスを提供します。この2つを組み合わせることで、予測可能なスケールアウト性能が実現します：Milvusはクエリをシャード全体に分散し、HPE Alletra Storage MP X10000のフラクショナルな多次元スケーリングは、データとQPSが増加してもレイテンシを一定に保ちます。簡単に言えば、必要なときに必要な容量やパフォーマンスを追加できる。HPE Alletra Storage MP X10000のエンタープライズ機能（暗号化、RBAC、不変性、堅牢な耐久性）は、強力なデータ主権と一貫したサービスレベル目標（SLO）を備えたオンプレミスまたはハイブリッド展開をサポートします。</p>
<p>ベクトル検索が大規模化すると、取り込み、圧縮、検索に時間がかかるとしてストレージが非難されることがよくあります。MilvusをHPE Alletra Storage MP X10000に搭載することで、このような状況は一変します。このプラットフォームの全NVMe、ログ構造化アーキテクチャ、およびGPUDirect RDMAオプションは、一貫性のある超低レイテンシのオブジェクトアクセスを実現します。実際には、RAGパイプラインはストレージに縛られるのではなく、計算に縛られたままです。コレクションが増え、クエリ量が急増しても、Milvusは応答性を維持し、HPE Alletra Storage MP X10000はI/Oヘッドルームを維持するため、ストレージを再設計することなく、予測可能でリニアなスケーラビリティを実現します。これは、RAGの導入規模が初期の概念実証段階を超え、本番環境に移行する際に特に重要になります。</p>
<h2 id="Enterprise-ready-RAG-Scalable-predictable-and-built-for-GenAI" class="common-anchor-header">エンタープライズ対応のRAG：スケーラブルで予測可能、そしてGenAIのために構築されている<button data-href="#Enterprise-ready-RAG-Scalable-predictable-and-built-for-GenAI" class="anchor-icon" translate="no">
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
    </button></h2><p>RAGとリアルタイムのGenAIワークロードのために、HPE Alletra Storage MP X10000とMilvusを組み合わせることで、自信を持って拡張できる将来対応可能な基盤が実現します。この統合ソリューションは、パフォーマンスや管理性に妥協することなく、高速で弾力性があり、セキュアなインテリジェントシステムの構築を可能にします。Milvusは、モジュール式スケーリングによりGPUアクセラレーションによる分散型ベクトル検索を提供し、HPE Alletra Storage MP X10000は、エンタープライズグレードの耐久性とライフサイクル管理により、超高速かつ低レイテンシーのオブジェクトアクセスを実現します。また、HPE Alletra Storage MP X10000は、エンタープライズグレードの耐久性とライフサイクル管理を備えた超高速で低レイテンシーのオブジェクトアクセスを実現します。リアルタイムのレコメンデーションサービス、セマンティック検索、数十億のベクトルにわたるスケーリングなど、このアーキテクチャはRAGパイプラインの応答性、コスト効率、クラウド最適化を維持します。KubernetesとHPE GreenLakeクラウドへのシームレスな統合により、統合管理、消費ベースの価格設定、ハイブリッドクラウドやプライベートクラウド環境への柔軟な展開が可能になります。HPE Alletra Storage MP X10000とMilvus: 最新のGenAIの需要に合わせて構築された、スケーラブルで高性能なRAGソリューション。</p>
