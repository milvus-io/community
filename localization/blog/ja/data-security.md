---
id: data-security.md
title: Milvusベクターデータベースはどのようにデータセキュリティを確保しているのか？
author: Angela Ni
date: 2022-09-05T00:00:00.000Z
desc: Milvusのユーザー認証とトランジット時の暗号化について学ぶ。
cover: assets.zilliz.com/Security_192e35a790.png
tag: Engineering
tags: 'Vector Database for AI, Artificial Intelligence, Machine Learning'
canonicalUrl: 'https://milvus.io/blog/data-security.md'
---
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Security_192e35a790.png" alt="Cover image" class="doc-image" id="cover-image" />
   </span> <span class="img-wrapper"> <span>カバー画像</span> </span></p>
<p>Milvus2.1では、データの安全性を考慮し、ユーザー認証とTLS（トランスポートレイヤーセキュリティ）接続が正式に利用できるようになりました。ユーザー認証がない場合、SDKを使えば誰でもベクターデータベースの全てのデータにアクセスすることができます。しかし、Milvus 2.1からは、有効なユーザ名とパスワードを持つ者のみがMilvusベクトルデータベースにアクセスすることができます。また、Milvus 2.1では、データのセキュリティがTLSによってさらに保護され、コンピュータネットワークにおける安全な通信が保証されています。</p>
<p>本稿では、Milvusベクトルデータベースがユーザー認証とTLS接続によってどのようにデータセキュリティを確保しているかを分析し、ベクトルデータベースを使用する際にデータセキュリティを確保したいユーザーとして、この2つの機能をどのように活用できるかを説明することを目的とする。</p>
<p><strong>戻る</strong></p>
<ul>
<li><a href="#What-is-database-security-and-why-is-it-important">データベースのセキュリティとは？</a></li>
<li><a href="#How-does-the-Milvus-vector-database-ensure-data-security">Milvusベクトルデータベースはどのようにデータセキュリティを確保しているのか？</a><ul>
<li><a href="#User-authentication">ユーザー認証</a></li>
<li><a href="#TLS-connection">TLS接続</a></li>
</ul></li>
</ul>
<h2 id="What-is-database-security-and-why-is-it-important" class="common-anchor-header">データベースのセキュリティとは何ですか？<button data-href="#What-is-database-security-and-why-is-it-important" class="anchor-icon" translate="no">
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
    </button></h2><p>データベースのセキュリティとは、データベース内のすべてのデータが安全であり、機密が保持されることを保証するために取られる措置のことを指します。<a href="https://firewalltimes.com/recent-data-breaches/">Twitter、Marriott、Texas Department of Insuranceなどにおける</a>最近のデータ漏洩事件は、データ・セキュリティの問題に対する私たちの警戒心をより強くしています。これらの事件はすべて、データが十分に保護され、使用しているデータベースが安全でなければ、企業やビジネスが深刻な損失を被る可能性があることを常に私たちに思い起こさせる。</p>
<h2 id="How-does-the-Milvus-vector-database-ensure-data-security" class="common-anchor-header">Milvusベクターデータベースはどのようにデータセキュリティを確保しているのでしょうか？<button data-href="#How-does-the-Milvus-vector-database-ensure-data-security" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 2.1では、認証と暗号化によりデータベースの安全性を確保しています。具体的には、アクセスレベルでは、Milvusはデータベースにアクセスできるユーザを制御するための基本的なユーザ認証をサポートしています。一方、データベースレベルでは、Milvusはデータ通信を保護するためにトランスポートレイヤセキュリティ(TLS)暗号化プロトコルを採用しています。</p>
<h3 id="User-authentication" class="common-anchor-header">ユーザ認証</h3><p>Milvusの基本的なユーザ認証機能は、データセキュリティのためにユーザ名とパスワードを使用してベクトルデータベースにアクセスすることをサポートします。つまり、クライアントは認証されたユーザ名とパスワードを提供した場合のみ、Milvusインスタンスにアクセスすることができます。</p>
<h4 id="The-authentication-workflow-in-the-Milvus-vector-database" class="common-anchor-header">Milvusベクトルデータベースにおける認証ワークフロー</h4><p>すべてのgRPCリクエストはMilvusプロキシによって処理されるため、認証はプロキシによって行われます。Milvusインスタンスに接続するための認証情報でログインするワークフローは以下の通りです。</p>
<ol>
<li>Milvusインスタンスごとに認証情報を作成し、暗号化したパスワードをetcdに保存する。MilvusはProvosとMazièresの<a href="http://www.usenix.org/event/usenix99/provos/provos.pdf">適応型ハッシュアルゴリズムを</a>実装しているため、暗号化には<a href="https://golang.org/x/crypto/bcrypt">bcryptを</a>使用する。</li>
<li>クライアント側では、Milvusサービスに接続する際にSDKが暗号文を送信する。Base64暗号文(<username>:<password>)はキー<code translate="no">authorization</code> でメタデータに添付される。</li>
<li>Milvusプロキシはリクエストをインターセプトし、クレデンシャルを検証する。</li>
<li>認証情報はプロキシにローカルにキャッシュされる。</li>
</ol>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1280_X1280_021e90e3c8.jpeg" alt="authetication_workflow" class="doc-image" id="authetication_workflow" />
   </span> <span class="img-wrapper"> <span>authetication_workflow</span> </span></p>
<p>クレデンシャルが更新されると、Milvus のシステムワークフローは以下のようになる。</p>
<ol>
<li>insert、query、deleteのAPIが呼ばれた場合、root coordがクレデンシャルを担当する。</li>
<li>パスワードを忘れたなどの理由でクレデンシャルを更新すると、新しいパスワードがetcdに永続化される。すると、プロキシのローカルキャッシュにある古い認証情報はすべて無効になる。</li>
<li>認証インターセプターは、まずローカルキャッシュからレコードを探します。キャッシュ内の認証情報が正しくない場合、ルートコーデ ィネートから最新のレコードをフェッチするためのRPCコールがトリガされる。そして、ローカルキャッシュのクレデンシャルはそれに応じて更新される。</li>
</ol>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/update_5af81a4173.jpeg" alt="credential_update_workflow" class="doc-image" id="credential_update_workflow" />
   </span> <span class="img-wrapper"> <span>クレデンシャル更新ワークフロー</span> </span></p>
<h4 id="How-to-manage-user-authentication-in-the-Milvus-vector-database" class="common-anchor-header">Milvusベクターデータベースのユーザー認証の管理方法</h4><p>認証を有効にするには、まずMilvusの設定ファイル<code translate="no">milvus.yaml</code> で<code translate="no">common.security.authorizationEnabled</code> を<code translate="no">true</code> に設定する必要があります。</p>
<p>認証を有効にすると、Milvusインスタンスにrootユーザが作成されます。このrootユーザは、初期パスワード<code translate="no">Milvus</code> 、Milvusベクターデータベースに接続することができます。</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> connections
connections.<span class="hljs-title function_">connect</span>(
    alias=<span class="hljs-string">&#x27;default&#x27;</span>,
    host=<span class="hljs-string">&#x27;localhost&#x27;</span>,
    port=<span class="hljs-string">&#x27;19530&#x27;</span>,
    user=<span class="hljs-string">&#x27;root_user&#x27;</span>,
    password=<span class="hljs-string">&#x27;Milvus&#x27;</span>,
)
<button class="copy-code-btn"></button></code></pre>
<p>Milvusを初めて起動する際には、rootユーザのパスワードを変更することを強くお勧めします。</p>
<p>その後、rootユーザはさらに新しいユーザを作成するために以下のコマンドを実行することにより、認証されたアクセスのための新しいユーザを作成することができます。</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> utility
utility.<span class="hljs-title function_">create_credential</span>(<span class="hljs-string">&#x27;user&#x27;</span>, <span class="hljs-string">&#x27;password&#x27;</span>, <span class="hljs-keyword">using</span>=<span class="hljs-string">&#x27;default&#x27;</span>) 
<button class="copy-code-btn"></button></code></pre>
<p>新規ユーザを作成する際に覚えておくべきことが2つあります：</p>
<ol>
<li><p>新しいユーザー名は32文字以内で、必ず文字で始めること。ユーザー名にはアンダースコア、アルファベット、数字のみを使用できます。例えば、「2abc!</p></li>
<li><p>パスワードの長さは6～256文字でなければならない。</p></li>
</ol>
<p>新しいクレデンシャルが設定されると、新しいユーザはそのユーザ名とパスワードでMilvusインスタンスに接続することができます。</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> connections
connections.<span class="hljs-title function_">connect</span>(
    alias=<span class="hljs-string">&#x27;default&#x27;</span>,
    host=<span class="hljs-string">&#x27;localhost&#x27;</span>,
    port=<span class="hljs-string">&#x27;19530&#x27;</span>,
    user=<span class="hljs-string">&#x27;user&#x27;</span>,
    password=<span class="hljs-string">&#x27;password&#x27;</span>,
)
<button class="copy-code-btn"></button></code></pre>
<p>他の認証プロセスと同様に、パスワードを忘れても心配する必要はありません。既存ユーザのパスワードは以下のコマンドでリセットできます。</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> utility
utility.<span class="hljs-title function_">reset_password</span>(<span class="hljs-string">&#x27;user&#x27;</span>, <span class="hljs-string">&#x27;new_password&#x27;</span>, <span class="hljs-keyword">using</span>=<span class="hljs-string">&#x27;default&#x27;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>ユーザ認証の詳細については、<a href="https://milvus.io/docs/v2.1.x/authenticate.md">Milvusのドキュメントを</a>お読みください。</p>
<h3 id="TLS-connection" class="common-anchor-header">TLS接続</h3><p>トランスポートレイヤーセキュリティ（TLS）は、コンピュータネットワークにおける通信セキュリティを提供するための認証プロトコルの一種です。TLSは証明書を使用して、2つ以上の通信当事者間で認証サービスを提供します。</p>
<h4 id="How-to-enable-TLS-in-the-Milvus-vector-database" class="common-anchor-header">MilvusベクターデータベースでTLSを有効にする方法</h4><p>MilvusでTLSを有効にするには、まず以下のコマンドを実行し、証明書を生成するための2つのファイルを用意する必要があります。<code translate="no">openssl.cnf</code> という名前のデフォルトのOpenSSL設定ファイルと、関連する証明書を生成するために使用される<code translate="no">gen.sh</code> という名前のファイルです。</p>
<pre><code translate="no"><span class="hljs-built_in">mkdir</span> cert &amp;&amp; <span class="hljs-built_in">cd</span> cert
<span class="hljs-built_in">touch</span> openssl.cnf gen.sh
<button class="copy-code-btn"></button></code></pre>
<p>次に、<a href="https://milvus.io/docs/v2.1.x/tls.md#Create-files">ここで</a>提供する設定を2つのファイルにコピー・アンド・ペーストするだけです。あるいは、私たちの設定をもとに、あなたのアプリケーションにより適した修正を加えることもできます。</p>
<p>2つのファイルの準備ができたら、<code translate="no">gen.sh</code> ファイルを実行して、9つの証明書ファイルを作成できます。同様に、9つの証明書ファイルの設定を必要に応じて変更することもできます。</p>
<pre><code translate="no"><span class="hljs-built_in">chmod</span> +x gen.sh
./gen.sh
<button class="copy-code-btn"></button></code></pre>
<p>MilvusサービスにTLSで接続する前に、最後のステップがあります。<code translate="no">tlsEnabled</code> を<code translate="no">true</code> に設定し、<code translate="no">server.pem</code> 、<code translate="no">server.key</code> 、<code translate="no">ca.pem</code> のファイルパスを<code translate="no">config/milvus.yaml</code> に設定する必要があります。下記のコードはその一例です。</p>
<pre><code translate="no">tls:
  serverPemPath: configs/cert/server.pem
  serverKeyPath: configs/cert/server.key
  caPemPath: configs/cert/ca.pem

common:
  security:
    tlsEnabled: <span class="hljs-literal">true</span>
<button class="copy-code-btn"></button></code></pre>
<p>Milvus接続SDKを使用する際、クライアント用に<code translate="no">client.pem</code>,<code translate="no">client.key</code>,<code translate="no">ca.pem</code> のファイルパスを指定すれば、TLSでMilvusサービスに接続することができます。下記のコードも一例です。</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> connections

_HOST = <span class="hljs-string">&#x27;127.0.0.1&#x27;</span>
_PORT = <span class="hljs-string">&#x27;19530&#x27;</span>

<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;\nCreate connection...&quot;</span>)
connections.connect(host=_HOST, port=_PORT, secure=<span class="hljs-literal">True</span>, client_pem_path=<span class="hljs-string">&quot;cert/client.pem&quot;</span>,
                        client_key_path=<span class="hljs-string">&quot;cert/client.key&quot;</span>,
                        ca_pem_path=<span class="hljs-string">&quot;cert/ca.pem&quot;</span>, server_name=<span class="hljs-string">&quot;localhost&quot;</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;\nList connections:&quot;</span>)
<span class="hljs-built_in">print</span>(connections.list_connections())
<button class="copy-code-btn"></button></code></pre>
<h2 id="Whats-next" class="common-anchor-header">今後の予定<button data-href="#Whats-next" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 2.1の正式リリースに伴い、新機能を紹介するブログシリーズを用意しました。詳しくはこちらのブログシリーズをご覧ください：</p>
<ul>
<li><a href="https://milvus.io/blog/2022-08-08-How-to-use-string-data-to-empower-your-similarity-search-applications.md">類似検索アプリケーションを強化する文字列データの使い方</a></li>
<li><a href="https://milvus.io/blog/embedded-milvus.md">組み込みMilvusを使用したPythonによるMilvusのインストールと実行</a></li>
<li><a href="https://milvus.io/blog/in-memory-replicas.md">インメモリレプリカによるベクターデータベースの読み取りスループットの向上</a></li>
<li><a href="https://milvus.io/blog/understanding-consistency-levels-in-the-milvus-vector-database.md">Milvusベクトルデータベースの一貫性レベルを理解する</a></li>
<li><a href="https://milvus.io/blog/understanding-consistency-levels-in-the-milvus-vector-database-2.md">Milvusベクタデータベースのコンシステンシーレベルを理解する(後編)</a></li>
<li><a href="https://milvus.io/blog/data-security.md">Milvus Vector Databaseはどのようにデータのセキュリティを確保しているのか？</a></li>
</ul>
