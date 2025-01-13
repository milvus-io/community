---
id: Implement-Milvus-CLI-by-Python-Click.md
title: 總覽
author: Zhen Chen
date: 2021-09-15T00:00:00.000Z
desc: 介紹如何基於 Python Click 實作 CLI。
tag: Engineering
isPublish: true
---
<custom-h1>以 Python Click 實作 Milvus CLI</custom-h1><ul>
<li><a href="#Implement-Milvus-CLI-by-Python-Click">使用 Python Click 實作 Milvus CLI</a><ul>
<li><a href="#Overview">概述</a></li>
<li><a href="#Group-commands">群組命令</a></li>
<li><a href="#Custom-a-command">自訂命令</a></li>
<li><a href="#Implement-prompt-cli-for-user-to-input">執行提示 CLI 供使用者輸入</a></li>
<li><a href="#Manually-implement-autocomplete">手動執行自動完成</a></li>
<li><a href="#Add-one-time-option">新增一次性選項</a></li>
<li><a href="#Build-and-release">建立和釋放</a></li>
<li><a href="#Learn-more-about-Milvus">進一步了解 Milvus</a></li>
</ul></li>
</ul>
<h2 id="Overview" class="common-anchor-header">總覽<button data-href="#Overview" class="anchor-icon" translate="no">
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
    </button></h2><p>專案網址: https://github.com/milvus-io/milvus_cli</p>
<p>準備：<code translate="no">Python3.8</code>,<a href="https://click.palletsprojects.com/en/8.0.x/api/"> <code translate="no">Click 8.0.x</code></a></p>
<h2 id="Group-commands" class="common-anchor-header">組命令<button data-href="#Group-commands" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Create-a-command" class="common-anchor-header">建立命令</h3><pre><code translate="no" class="language-python"><span class="hljs-keyword">import</span> click
<span class="hljs-keyword">from</span> utils <span class="hljs-keyword">import</span> PyOrm

<span class="hljs-meta">@click.group(<span class="hljs-params">no_args_is_help=<span class="hljs-literal">False</span>, add_help_option=<span class="hljs-literal">False</span>, invoke_without_command=<span class="hljs-literal">True</span></span>)</span>
<span class="hljs-meta">@click.pass_context</span>
<span class="hljs-keyword">def</span> <span class="hljs-title function_">cli</span>(<span class="hljs-params">ctx</span>):
    <span class="hljs-string">&quot;&quot;&quot;Milvus CLI&quot;&quot;&quot;</span>
    ctx.obj = PyOrm() <span class="hljs-comment"># PyOrm is a util class which wraps the milvus python SDK. You can pass any class instance here. Any command function passed by @click.obj can call it.</span>

<span class="hljs-keyword">if</span> __name__ == <span class="hljs-string">&#x27;__main__&#x27;</span>:
    cli()
<button class="copy-code-btn"></button></code></pre>
<p>如上面的程式碼，我們使用<code translate="no">@click.group()</code> 建立一個命令群組<code translate="no">cli</code> 作為入口點。為了實現提示式 CLI，我們需要停用入口的幫助訊息，因此我們加入<code translate="no">no_args_is_help=False</code>,<code translate="no">add_help_option=False</code> 和<code translate="no">invoke_without_command=True</code> 。如果我們只在終端輸入<code translate="no">cli</code> ，則不會列印任何內容。</p>
<p>此外，我們使用<code translate="no">@click.pass_context</code> 傳送一個上下文給這個群組，以便進一步使用。</p>
<h3 id="Create-a-sub-command-of-command-group" class="common-anchor-header">建立命令群組的子命令</h3><p>然後，我們在<code translate="no">cli</code> 之下新增第一個子指令<code translate="no">help</code> ：</p>
<pre><code translate="no" class="language-python"><span class="hljs-comment"># Print the help message of specified command.</span>
<span class="hljs-keyword">def</span> <span class="hljs-title function_">print_help_msg</span>(<span class="hljs-params">command</span>):
    <span class="hljs-keyword">with</span> click.Context(command) <span class="hljs-keyword">as</span> ctx:
        click.echo(command.get_help(ctx))


<span class="hljs-comment"># Use @cli.command() to create a sub command of cli.</span>
<span class="hljs-meta">@cli.command()</span>
<span class="hljs-keyword">def</span> <span class="hljs-title function_">help</span>():
    <span class="hljs-string">&quot;&quot;&quot;Show help messages.&quot;&quot;&quot;</span>
    <span class="hljs-comment"># Print help message of cli.</span>
    click.echo(print_help_msg(cli))
<button class="copy-code-btn"></button></code></pre>
<p>現在我們可以在終端機使用<code translate="no">cli help</code> ：</p>
<pre><code translate="no" class="language-shell">$ python milvus_cli/scripts/milvus_cli.py <span class="hljs-built_in">help</span>
<button class="copy-code-btn"></button></code></pre>
<h3 id="Create-a-sub-group-of-a-command-group" class="common-anchor-header">建立命令群組的子群組</h3><p>我們不僅要有像<code translate="no">cli help</code> 這樣的子命令，還需要子命令群組，如<code translate="no">cli list collection</code> 、<code translate="no">cli list partition</code> 和<code translate="no">cli list indexes</code> 。</p>
<p>首先我們建立一個子命令群組<code translate="no">list</code> ，在這裡我們可以將第一個參數傳給<code translate="no">@cli.group</code> 作為命令名稱，而不是使用 Defult 函式名稱，這樣我們就可以減少重複的函式名稱。</p>
<p>注意，這裡我們使用<code translate="no">@cli.group()</code> 而不是<code translate="no">@click.group</code> ，這樣我們就建立了 origin 群組的子群組。</p>
<p>我們使用<code translate="no">@click.pass_obj</code> 將<code translate="no">context.obj</code> 傳給這個子群組的子指令。</p>
<pre><code translate="no" class="language-python"><span class="hljs-meta">@cli.group(<span class="hljs-params"><span class="hljs-string">&#x27;list&#x27;</span>, no_args_is_help=<span class="hljs-literal">False</span></span>)</span>
<span class="hljs-meta">@click.pass_obj</span>
<span class="hljs-keyword">def</span> <span class="hljs-title function_">listDetails</span>(<span class="hljs-params">obj</span>):
    <span class="hljs-string">&quot;&quot;&quot;List collections, partitions and indexes.&quot;&quot;&quot;</span>
    <span class="hljs-keyword">pass</span>
<button class="copy-code-btn"></button></code></pre>
<p>然後，我們使用<code translate="no">@listDetails.command()</code> (不是<code translate="no">@cli.command()</code>)，將一些子指令加入這個子群組。這裡只是一個範例，您可以忽略實作，我們稍後會討論。</p>
<pre><code translate="no" class="language-python"><span class="hljs-meta">@listDetails.command()</span>
<span class="hljs-meta">@click.option(<span class="hljs-params"><span class="hljs-string">&#x27;--timeout&#x27;</span>, <span class="hljs-string">&#x27;timeout&#x27;</span>, <span class="hljs-built_in">help</span>=<span class="hljs-string">&quot;[Optional] - An optional duration of time in seconds to allow for the RPC. When timeout is set to None, client waits until server response or error occur.&quot;</span>, default=<span class="hljs-literal">None</span></span>)</span>
<span class="hljs-meta">@click.option(<span class="hljs-params"><span class="hljs-string">&#x27;--show-loaded&#x27;</span>, <span class="hljs-string">&#x27;showLoaded&#x27;</span>, <span class="hljs-built_in">help</span>=<span class="hljs-string">&quot;[Optional] - Only show loaded collections.&quot;</span>, default=<span class="hljs-literal">False</span></span>)</span>
<span class="hljs-meta">@click.pass_obj</span>
<span class="hljs-keyword">def</span> <span class="hljs-title function_">collections</span>(<span class="hljs-params">obj, timeout, showLoaded</span>):
    <span class="hljs-string">&quot;&quot;&quot;List all collections.&quot;&quot;&quot;</span>
    <span class="hljs-keyword">try</span>:
        obj.checkConnection()
        click.echo(obj.listCollections(timeout, showLoaded))
    <span class="hljs-keyword">except</span> Exception <span class="hljs-keyword">as</span> e:
        click.echo(message=e, err=<span class="hljs-literal">True</span>)


<span class="hljs-meta">@listDetails.command()</span>
<span class="hljs-meta">@click.option(<span class="hljs-params"><span class="hljs-string">&#x27;-c&#x27;</span>, <span class="hljs-string">&#x27;--collection&#x27;</span>, <span class="hljs-string">&#x27;collection&#x27;</span>, <span class="hljs-built_in">help</span>=<span class="hljs-string">&#x27;The name of collection.&#x27;</span>, default=<span class="hljs-string">&#x27;&#x27;</span></span>)</span>
<span class="hljs-meta">@click.pass_obj</span>
<span class="hljs-keyword">def</span> <span class="hljs-title function_">partitions</span>(<span class="hljs-params">obj, collection</span>):
    <span class="hljs-string">&quot;&quot;&quot;List all partitions of the specified collection.&quot;&quot;&quot;</span>
    <span class="hljs-keyword">try</span>:
        obj.checkConnection()
        validateParamsByCustomFunc(
            obj.getTargetCollection, <span class="hljs-string">&#x27;Collection Name Error!&#x27;</span>, collection)
        click.echo(obj.listPartitions(collection))
    <span class="hljs-keyword">except</span> Exception <span class="hljs-keyword">as</span> e:
        click.echo(message=e, err=<span class="hljs-literal">True</span>)
<button class="copy-code-btn"></button></code></pre>
<p>所有這些完成之後，我們就有一個類似如下的 miltigroup 指令：</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://user-images.githubusercontent.com/83751452/132306467-71d81e50-3d6c-4fbe-81fc-db7280cb4838.png" alt="image" class="doc-image" id="image" />
   </span> <span class="img-wrapper"> <span>影像</span> </span></p>
<h2 id="Custom-a-command" class="common-anchor-header">自訂指令<button data-href="#Custom-a-command" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Add-options" class="common-anchor-header">新增選項</h3><p>您可以在命令中加入一些選項，這些選項會像<code translate="no">cli --test-option value</code> 般使用。</p>
<p>這裡有一個範例，我們加入三個選項<code translate="no">alias</code>,<code translate="no">host</code> 和<code translate="no">port</code> 來指定連接到 Milvus 的位址。</p>
<p>前兩個參數定義了選項的簡短和完整名稱，第三個參數定義了變量名稱，<code translate="no">help</code> 參數指定了簡短的幫助信息，<code translate="no">default</code> 參數指定了預設值，<code translate="no">type</code> 指定了值類型。</p>
<p>所有選項的值會依序傳入函式。</p>
<pre><code translate="no" class="language-python"><span class="hljs-meta">@cli.command(<span class="hljs-params">no_args_is_help=<span class="hljs-literal">False</span></span>)</span>
<span class="hljs-meta">@click.option(<span class="hljs-params"><span class="hljs-string">&#x27;-a&#x27;</span>, <span class="hljs-string">&#x27;--alias&#x27;</span>, <span class="hljs-string">&#x27;alias&#x27;</span>, <span class="hljs-built_in">help</span>=<span class="hljs-string">&quot;Milvus link alias name, default is `default`.&quot;</span>, default=<span class="hljs-string">&#x27;default&#x27;</span>, <span class="hljs-built_in">type</span>=<span class="hljs-built_in">str</span></span>)</span>
<span class="hljs-meta">@click.option(<span class="hljs-params"><span class="hljs-string">&#x27;-h&#x27;</span>, <span class="hljs-string">&#x27;--host&#x27;</span>, <span class="hljs-string">&#x27;host&#x27;</span>, <span class="hljs-built_in">help</span>=<span class="hljs-string">&quot;Host name, default is `127.0.0.1`.&quot;</span>, default=<span class="hljs-string">&#x27;127.0.0.1&#x27;</span>, <span class="hljs-built_in">type</span>=<span class="hljs-built_in">str</span></span>)</span>
<span class="hljs-meta">@click.option(<span class="hljs-params"><span class="hljs-string">&#x27;-p&#x27;</span>, <span class="hljs-string">&#x27;--port&#x27;</span>, <span class="hljs-string">&#x27;port&#x27;</span>, <span class="hljs-built_in">help</span>=<span class="hljs-string">&quot;Port, default is `19530`.&quot;</span>, default=<span class="hljs-number">19530</span>, <span class="hljs-built_in">type</span>=<span class="hljs-built_in">int</span></span>)</span>
<span class="hljs-meta">@click.pass_obj</span>
<span class="hljs-keyword">def</span> <span class="hljs-title function_">connect</span>(<span class="hljs-params">obj, alias, host, port</span>):
    <span class="hljs-keyword">pass</span>
<button class="copy-code-btn"></button></code></pre>
<h3 id="Add-flag-options" class="common-anchor-header">新增旗標選項</h3><p>我們在上面使用選項來傳遞一個值，但有些時候我們只需要一個旗標作為布林值。</p>
<p>就像下面的範例，選項<code translate="no">autoId</code> 是一個旗標選項，不傳任何資料給函數，所以我們可以像<code translate="no">cli create collection -c c_name -p p_name -a</code> 般使用它。</p>
<pre><code translate="no" class="language-python"><span class="hljs-meta">@createDetails.command(<span class="hljs-params"><span class="hljs-string">&#x27;collection&#x27;</span></span>)</span>
<span class="hljs-meta">@click.option(<span class="hljs-params"><span class="hljs-string">&#x27;-c&#x27;</span>, <span class="hljs-string">&#x27;--collection-name&#x27;</span>, <span class="hljs-string">&#x27;collectionName&#x27;</span>, <span class="hljs-built_in">help</span>=<span class="hljs-string">&#x27;Collection name to be created.&#x27;</span>, default=<span class="hljs-string">&#x27;&#x27;</span></span>)</span>
<span class="hljs-meta">@click.option(<span class="hljs-params"><span class="hljs-string">&#x27;-p&#x27;</span>, <span class="hljs-string">&#x27;--schema-primary-field&#x27;</span>, <span class="hljs-string">&#x27;primaryField&#x27;</span>, <span class="hljs-built_in">help</span>=<span class="hljs-string">&#x27;Primary field name.&#x27;</span>, default=<span class="hljs-string">&#x27;&#x27;</span></span>)</span>
<span class="hljs-meta">@click.option(<span class="hljs-params"><span class="hljs-string">&#x27;-a&#x27;</span>, <span class="hljs-string">&#x27;--schema-auto-id&#x27;</span>, <span class="hljs-string">&#x27;autoId&#x27;</span>, <span class="hljs-built_in">help</span>=<span class="hljs-string">&#x27;Enable auto id.&#x27;</span>, default=<span class="hljs-literal">False</span>, is_flag=<span class="hljs-literal">True</span></span>)</span>
<span class="hljs-meta">@click.pass_obj</span>
<span class="hljs-keyword">def</span> <span class="hljs-title function_">createCollection</span>(<span class="hljs-params">obj, collectionName, primaryField, autoId, description, fields</span>):
    <span class="hljs-keyword">pass</span>
<button class="copy-code-btn"></button></code></pre>
<h3 id="Add-arguments" class="common-anchor-header">新增參數</h3><p>在這個專案中，我們用選項取代了所有的參數用法。但我們仍會在這裡介紹參數的用法。與選項不同，arguments 的用法就像<code translate="no">cli COMMAND [OPTIONS] ARGUEMENTS</code> 。如果我們將上面的範例轉換成 argements 的用法，就會變成這樣：</p>
<pre><code translate="no" class="language-python"><span class="hljs-meta">@createDetails.command(<span class="hljs-params"><span class="hljs-string">&#x27;collection&#x27;</span></span>)</span>
<span class="hljs-meta">@click.argument(<span class="hljs-params"><span class="hljs-string">&#x27;collectionName&#x27;</span></span>)</span>
<span class="hljs-meta">@click.option(<span class="hljs-params"><span class="hljs-string">&#x27;-p&#x27;</span>, <span class="hljs-string">&#x27;--schema-primary-field&#x27;</span>, <span class="hljs-string">&#x27;primaryField&#x27;</span>, <span class="hljs-built_in">help</span>=<span class="hljs-string">&#x27;Primary field name.&#x27;</span>, default=<span class="hljs-string">&#x27;&#x27;</span></span>)</span>
<span class="hljs-meta">@click.option(<span class="hljs-params"><span class="hljs-string">&#x27;-a&#x27;</span>, <span class="hljs-string">&#x27;--schema-auto-id&#x27;</span>, <span class="hljs-string">&#x27;autoId&#x27;</span>, <span class="hljs-built_in">help</span>=<span class="hljs-string">&#x27;Enable auto id.&#x27;</span>, default=<span class="hljs-literal">False</span>, is_flag=<span class="hljs-literal">True</span></span>)</span>
<span class="hljs-meta">@click.pass_obj</span>
<span class="hljs-keyword">def</span> <span class="hljs-title function_">createCollection</span>(<span class="hljs-params">obj, collectionName, primaryField, autoId, description, fields</span>):
    <span class="hljs-keyword">pass</span>
<button class="copy-code-btn"></button></code></pre>
<p>那麼用法應該是<code translate="no">cli create collection c_name -p p_name -a</code> 。</p>
<h3 id="Add-full-help-message" class="common-anchor-header">新增完整說明資訊</h3><p>正如我們在上面定義了簡短的幫助訊息，我們也可以在函式中定義完整的幫助訊息：</p>
<pre><code translate="no" class="language-python"><span class="hljs-meta">@cli.command(<span class="hljs-params">no_args_is_help=<span class="hljs-literal">False</span></span>)</span>
<span class="hljs-meta">@click.option(<span class="hljs-params"><span class="hljs-string">&#x27;-a&#x27;</span>, <span class="hljs-string">&#x27;--alias&#x27;</span>, <span class="hljs-string">&#x27;alias&#x27;</span>, <span class="hljs-built_in">help</span>=<span class="hljs-string">&quot;Milvus link alias name, default is `default`.&quot;</span>, default=<span class="hljs-string">&#x27;default&#x27;</span>, <span class="hljs-built_in">type</span>=<span class="hljs-built_in">str</span></span>)</span>
<span class="hljs-meta">@click.option(<span class="hljs-params"><span class="hljs-string">&#x27;-h&#x27;</span>, <span class="hljs-string">&#x27;--host&#x27;</span>, <span class="hljs-string">&#x27;host&#x27;</span>, <span class="hljs-built_in">help</span>=<span class="hljs-string">&quot;Host name, default is `127.0.0.1`.&quot;</span>, default=<span class="hljs-string">&#x27;127.0.0.1&#x27;</span>, <span class="hljs-built_in">type</span>=<span class="hljs-built_in">str</span></span>)</span>
<span class="hljs-meta">@click.option(<span class="hljs-params"><span class="hljs-string">&#x27;-p&#x27;</span>, <span class="hljs-string">&#x27;--port&#x27;</span>, <span class="hljs-string">&#x27;port&#x27;</span>, <span class="hljs-built_in">help</span>=<span class="hljs-string">&quot;Port, default is `19530`.&quot;</span>, default=<span class="hljs-number">19530</span>, <span class="hljs-built_in">type</span>=<span class="hljs-built_in">int</span></span>)</span>
<span class="hljs-meta">@click.pass_obj</span>
<span class="hljs-keyword">def</span> <span class="hljs-title function_">connect</span>(<span class="hljs-params">obj, alias, host, port</span>):
    <span class="hljs-string">&quot;&quot;&quot;
    Connect to Milvus.

    Example:

        milvus_cli &gt; connect -h 127.0.0.1 -p 19530 -a default
    &quot;&quot;&quot;</span>
    <span class="hljs-keyword">try</span>:
        obj.connect(alias, host, port)
    <span class="hljs-keyword">except</span> Exception <span class="hljs-keyword">as</span> e:
        click.echo(message=e, err=<span class="hljs-literal">True</span>)
    <span class="hljs-keyword">else</span>:
        click.echo(<span class="hljs-string">&quot;Connect Milvus successfully!&quot;</span>)
        click.echo(obj.showConnection(alias))
<button class="copy-code-btn"></button></code></pre>
<p>在函數中的第一個區塊是幫助訊息，它會在我們輸入<code translate="no">cli connect --help</code> 後列印出來。</p>
<pre><code translate="no" class="language-shell">milvus_cli &gt; connect --help
Usage: milvus_cli.py connect [OPTIONS]

  Connect to Milvus.

  Example:

      milvus_cli &gt; connect -h <span class="hljs-number">127.0</span><span class="hljs-number">.0</span><span class="hljs-number">.1</span> -p <span class="hljs-number">19530</span> -a <span class="hljs-literal">default</span>

Options:
  -a, --<span class="hljs-keyword">alias</span> TEXT    Milvus link <span class="hljs-keyword">alias</span> name, <span class="hljs-literal">default</span> <span class="hljs-keyword">is</span> `<span class="hljs-literal">default</span>`.
  -h, --host TEXT     Host name, <span class="hljs-literal">default</span> <span class="hljs-keyword">is</span> `<span class="hljs-number">127.0</span><span class="hljs-number">.0</span><span class="hljs-number">.1</span>`.
  -p, --port INTEGER  Port, <span class="hljs-literal">default</span> <span class="hljs-keyword">is</span> `<span class="hljs-number">19530</span>`.
  --help              Show <span class="hljs-keyword">this</span> message <span class="hljs-keyword">and</span> exit.
<button class="copy-code-btn"></button></code></pre>
<h3 id="Add-confirm" class="common-anchor-header">新增確認</h3><p>有時我們需要使用者確認某些動作，特別是刪除某些東西。我們可以加入<code translate="no">click.confirm</code> 來暫停並請使用者確認：</p>
<pre><code translate="no" class="language-python"><span class="hljs-meta">@deleteSth.command(<span class="hljs-params"><span class="hljs-string">&#x27;collection&#x27;</span></span>)</span>
<span class="hljs-meta">@click.option(<span class="hljs-params"><span class="hljs-string">&#x27;-c&#x27;</span>, <span class="hljs-string">&#x27;--collection&#x27;</span>, <span class="hljs-string">&#x27;collectionName&#x27;</span>, <span class="hljs-built_in">help</span>=<span class="hljs-string">&#x27;The name of collection to be deleted.&#x27;</span>, default=<span class="hljs-string">&#x27;&#x27;</span></span>)</span>
<span class="hljs-meta">@click.option(<span class="hljs-params"><span class="hljs-string">&#x27;-t&#x27;</span>, <span class="hljs-string">&#x27;--timeout&#x27;</span>, <span class="hljs-string">&#x27;timeout&#x27;</span>, <span class="hljs-built_in">help</span>=<span class="hljs-string">&#x27;An optional duration of time in seconds to allow for the RPC. If timeout is set to None, the client keeps waiting until the server responds or an error occurs.&#x27;</span>, default=<span class="hljs-literal">None</span>, <span class="hljs-built_in">type</span>=<span class="hljs-built_in">int</span></span>)</span>
<span class="hljs-meta">@click.pass_obj</span>
<span class="hljs-keyword">def</span> <span class="hljs-title function_">deleteCollection</span>(<span class="hljs-params">obj, collectionName, timeout</span>):
    <span class="hljs-string">&quot;&quot;&quot;
    Drops the collection together with its index files.

    Example:

        milvus_cli &gt; delete collection -c car
    &quot;&quot;&quot;</span>
    click.echo(
        <span class="hljs-string">&quot;Warning!\nYou are trying to delete the collection with data. This action cannot be undone!\n&quot;</span>)
    <span class="hljs-keyword">if</span> <span class="hljs-keyword">not</span> click.confirm(<span class="hljs-string">&#x27;Do you want to continue?&#x27;</span>):
        <span class="hljs-keyword">return</span>
    <span class="hljs-keyword">pass</span>
<button class="copy-code-btn"></button></code></pre>
<p>如上面的範例，確認對話會顯示為<code translate="no">Aborted!ant to continue? [y/N]:</code> 。</p>
<h3 id="Add-prompts" class="common-anchor-header">新增提示</h3><p>要實現提示，我們只需要新增<code translate="no">click.prompt</code> 。</p>
<pre><code translate="no" class="language-python"><span class="hljs-meta">@cli.command()</span>
<span class="hljs-meta">@click.pass_obj</span>
<span class="hljs-keyword">def</span> <span class="hljs-title function_">query</span>(<span class="hljs-params">obj</span>):
    <span class="hljs-string">&quot;&quot;&quot;
    Query with a set of criteria, and results in a list of records that match the query exactly.
    &quot;&quot;&quot;</span>
    collectionName = click.prompt(
        <span class="hljs-string">&#x27;Collection name&#x27;</span>, <span class="hljs-built_in">type</span>=click.Choice(obj._list_collection_names()))
    expr = click.prompt(<span class="hljs-string">&#x27;The query expression(field_name in [x,y])&#x27;</span>)
    partitionNames = click.prompt(
        <span class="hljs-string">f&#x27;The names of partitions to search(split by &quot;,&quot; if multiple) <span class="hljs-subst">{obj._list_partition_names(collectionName)}</span>&#x27;</span>, default=<span class="hljs-string">&#x27;&#x27;</span>)
    outputFields = click.prompt(
        <span class="hljs-string">f&#x27;Fields to return(split by &quot;,&quot; if multiple) <span class="hljs-subst">{obj._list_field_names(collectionName)}</span>&#x27;</span>, default=<span class="hljs-string">&#x27;&#x27;</span>)
    timeout = click.prompt(<span class="hljs-string">&#x27;timeout&#x27;</span>, default=<span class="hljs-string">&#x27;&#x27;</span>)
    <span class="hljs-keyword">pass</span>
<button class="copy-code-btn"></button></code></pre>
<p>提示將在每個<code translate="no">click.prompt</code> 時顯示。我們使用一些連續的提示，讓它看起來像一個連續的對話。這可確保使用者按照我們想要的順序輸入資料。在本例中，我們需要使用者先選擇一個集合，然後我們需要取得此集合下的所有分割區，再顯示給使用者選擇。</p>
<h3 id="Add-choices" class="common-anchor-header">新增選擇</h3><p>有時您希望使用者只輸入有限範圍/類型的值，您可以將<code translate="no">type=click.Choice([&lt;any&gt;])</code> 加到<code translate="no">click.prompt</code>,<code translate="no">click.options</code> 等等...</p>
<p>例如</p>
<pre><code translate="no" class="language-python">collectionName = click.prompt(
        <span class="hljs-string">&#x27;Collection name&#x27;</span>, <span class="hljs-built_in">type</span>=click.Choice([<span class="hljs-string">&#x27;collection_1&#x27;</span>, <span class="hljs-string">&#x27;collection_2&#x27;</span>]))
<button class="copy-code-btn"></button></code></pre>
<p>則使用者只能輸入<code translate="no">collection_1</code> 或<code translate="no">collection_2</code> ，若有其他輸入則會出錯。</p>
<h3 id="Add-clear-screen" class="common-anchor-header">新增清除畫面</h3><p>您可以使用<code translate="no">click.clear()</code> 來實現。</p>
<pre><code translate="no" class="language-python"><span class="hljs-meta">@cli.command()</span>
<span class="hljs-keyword">def</span> <span class="hljs-title function_">clear</span>():
    <span class="hljs-string">&quot;&quot;&quot;Clear screen.&quot;&quot;&quot;</span>
    click.clear()
<button class="copy-code-btn"></button></code></pre>
<h3 id="Additional-tips" class="common-anchor-header">附加提示</h3><ul>
<li>預設值為<code translate="no">None</code> ，所以如果您指定預設值為<code translate="no">None</code> 就沒有意義了。而預設值<code translate="no">None</code> 會導致<code translate="no">click.prompt</code> 持續顯示，如果您要留空值跳過它。</li>
</ul>
<h2 id="Implement-prompt-CLI-for-user-to-input" class="common-anchor-header">實施提示 CLI 讓使用者輸入<button data-href="#Implement-prompt-CLI-for-user-to-input" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Why-prompt-CLI" class="common-anchor-header">為什麼要提示 CLI</h3><p>為了操作資料庫，我們需要連線到一個實例。如果我們使用 origin 命令列模式，每次執行完命令後，連線就會被刪除。我們也希望在使用 CLI 時儲存一些資料，並在離開後清理這些資料。</p>
<h3 id="Implement" class="common-anchor-header">執行</h3><ol>
<li>使用<code translate="no">while True</code> 來持續監聽使用者的輸入。</li>
</ol>
<pre><code translate="no" class="language-python"><span class="hljs-keyword">def</span> <span class="hljs-title function_">runCliPrompt</span>():
    <span class="hljs-keyword">while</span> <span class="hljs-literal">True</span>:
        astr = <span class="hljs-built_in">input</span>(<span class="hljs-string">&#x27;milvus_cli &gt; &#x27;</span>)
        <span class="hljs-keyword">try</span>:
            cli(astr.split())
        <span class="hljs-keyword">except</span> SystemExit:
            <span class="hljs-comment"># trap argparse error message</span>
            <span class="hljs-comment"># print(&#x27;error&#x27;, SystemExit)</span>
            <span class="hljs-keyword">continue</span>


<span class="hljs-keyword">if</span> __name__ == <span class="hljs-string">&#x27;__main__&#x27;</span>:
    runCliPrompt()
<button class="copy-code-btn"></button></code></pre>
<ol start="2">
<li>只使用<code translate="no">input</code> 會導致<code translate="no">up</code>,<code translate="no">down</code>,<code translate="no">left</code>,<code translate="no">right</code> 方向鍵、<code translate="no">tab</code> 鍵和一些其他按鍵自動轉換為 Acsii 字串。此外，歷史指令無法從 session 讀取。因此我們將<code translate="no">readline</code> 加入<code translate="no">runCliPrompt</code> 函式。</li>
</ol>
<pre><code translate="no" class="language-python"><span class="hljs-keyword">def</span> <span class="hljs-title function_">runCliPrompt</span>():
    <span class="hljs-keyword">while</span> <span class="hljs-literal">True</span>:
            <span class="hljs-keyword">import</span> readline
        readline.set_completer_delims(<span class="hljs-string">&#x27; \t\n;&#x27;</span>)
        astr = <span class="hljs-built_in">input</span>(<span class="hljs-string">&#x27;milvus_cli &gt; &#x27;</span>)
        <span class="hljs-keyword">try</span>:
            cli(astr.split())
        <span class="hljs-keyword">except</span> SystemExit:
            <span class="hljs-comment"># trap argparse error message</span>
            <span class="hljs-comment"># print(&#x27;error&#x27;, SystemExit)</span>
            <span class="hljs-keyword">continue</span>
<button class="copy-code-btn"></button></code></pre>
<ol start="3">
<li>新增<code translate="no">quit</code> CLI。</li>
</ol>
<pre><code translate="no" class="language-python"><span class="hljs-meta">@cli.command(<span class="hljs-params"><span class="hljs-string">&#x27;exit&#x27;</span></span>)</span>
<span class="hljs-keyword">def</span> <span class="hljs-title function_">quitapp</span>():
    <span class="hljs-string">&quot;&quot;&quot;Exit the CLI.&quot;&quot;&quot;</span>
    <span class="hljs-keyword">global</span> quitapp
    quitapp = <span class="hljs-literal">True</span>


quitapp = <span class="hljs-literal">False</span>  <span class="hljs-comment"># global flag</span>


<span class="hljs-keyword">def</span> <span class="hljs-title function_">runCliPrompt</span>():
    <span class="hljs-keyword">while</span> <span class="hljs-keyword">not</span> quitapp:
            <span class="hljs-keyword">import</span> readline
        readline.set_completer_delims(<span class="hljs-string">&#x27; \t\n;&#x27;</span>)
        astr = <span class="hljs-built_in">input</span>(<span class="hljs-string">&#x27;milvus_cli &gt; &#x27;</span>)
        <span class="hljs-keyword">try</span>:
            cli(astr.split())
        <span class="hljs-keyword">except</span> SystemExit:
            <span class="hljs-comment"># trap argparse error message</span>
            <span class="hljs-comment"># print(&#x27;error&#x27;, SystemExit)</span>
            <span class="hljs-keyword">continue</span>
<button class="copy-code-btn"></button></code></pre>
<ol start="4">
<li>當使用<code translate="no">ctrl C</code> 退出時，捕捉<code translate="no">KeyboardInterrupt</code> 錯誤。</li>
</ol>
<pre><code translate="no" class="language-python"><span class="hljs-keyword">def</span> <span class="hljs-title function_">runCliPrompt</span>():
    <span class="hljs-keyword">try</span>:
        <span class="hljs-keyword">while</span> <span class="hljs-keyword">not</span> quitapp:
            <span class="hljs-keyword">import</span> readline
            readline.set_completer_delims(<span class="hljs-string">&#x27; \t\n;&#x27;</span>)
            astr = <span class="hljs-built_in">input</span>(<span class="hljs-string">&#x27;milvus_cli &gt; &#x27;</span>)
            <span class="hljs-keyword">try</span>:
                cli(astr.split())
            <span class="hljs-keyword">except</span> SystemExit:
                <span class="hljs-comment"># trap argparse error message</span>
                <span class="hljs-comment"># print(&#x27;error&#x27;, SystemExit)</span>
                <span class="hljs-keyword">continue</span>
    <span class="hljs-keyword">except</span> KeyboardInterrupt:
        sys.exit(<span class="hljs-number">0</span>)
<button class="copy-code-btn"></button></code></pre>
<ol start="5">
<li>全部完成後，CLI 現在看起來就像這樣：</li>
</ol>
<pre><code translate="no" class="language-shell">milvus_cli &gt;
milvus_cli &gt; connect
+-------+-----------+
| Host  | <span class="hljs-number">127.0</span><span class="hljs-number">.0</span><span class="hljs-number">.1</span> |
| Port  |   <span class="hljs-number">19530</span>   |
| Alias |  default  |
+-------+-----------+

milvus_cli &gt; <span class="hljs-built_in">help</span>
Usage:  [OPTIONS] COMMAND [ARGS]...

  Milvus CLI

Commands:
  clear     Clear screen.
  connect   Connect to Milvus.
  create    Create collection, partition <span class="hljs-keyword">and</span> index.
  delete    Delete specified collection, partition <span class="hljs-keyword">and</span> index.
  describe  Describe collection <span class="hljs-keyword">or</span> partition.
  exit      Exit the CLI.
  <span class="hljs-built_in">help</span>      Show <span class="hljs-built_in">help</span> messages.
  <span class="hljs-keyword">import</span>    Import data <span class="hljs-keyword">from</span> csv file <span class="hljs-keyword">with</span> headers <span class="hljs-keyword">and</span> insert into target...
  <span class="hljs-built_in">list</span>      <span class="hljs-type">List</span> collections, partitions <span class="hljs-keyword">and</span> indexes.
  load      Load specified collection.
  query     Query <span class="hljs-keyword">with</span> a <span class="hljs-built_in">set</span> of criteria, <span class="hljs-keyword">and</span> results <span class="hljs-keyword">in</span> a <span class="hljs-built_in">list</span> of...
  release   Release specified collection.
  search    Conducts a vector similarity search <span class="hljs-keyword">with</span> an optional boolean...
  show      Show connection, loading_progress <span class="hljs-keyword">and</span> index_progress.
  version   Get Milvus CLI version.

milvus_cli &gt; exit
<button class="copy-code-btn"></button></code></pre>
<h2 id="Manually-implement-autocomplete" class="common-anchor-header">手動實作自動完成<button data-href="#Manually-implement-autocomplete" class="anchor-icon" translate="no">
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
    </button></h2><p>與 click 的 shell 自動完成不同，我們的專案會包覆命令列，並使用循環來取得使用者的輸入，以執行提示命令列。因此我們需要綁定一個完成器到<code translate="no">readline</code> 。</p>
<pre><code translate="no" class="language-python"><span class="hljs-keyword">class</span> <span class="hljs-title class_">Completer</span>(<span class="hljs-title class_ inherited__">object</span>):
    RE_SPACE = re.<span class="hljs-built_in">compile</span>(<span class="hljs-string">&#x27;.*\s+$&#x27;</span>, re.M)
    CMDS_DICT = {
        <span class="hljs-string">&#x27;clear&#x27;</span>: [],
        <span class="hljs-string">&#x27;connect&#x27;</span>: [],
        <span class="hljs-string">&#x27;create&#x27;</span>: [<span class="hljs-string">&#x27;collection&#x27;</span>, <span class="hljs-string">&#x27;partition&#x27;</span>, <span class="hljs-string">&#x27;index&#x27;</span>],
        <span class="hljs-string">&#x27;delete&#x27;</span>: [<span class="hljs-string">&#x27;collection&#x27;</span>, <span class="hljs-string">&#x27;partition&#x27;</span>, <span class="hljs-string">&#x27;index&#x27;</span>],
        <span class="hljs-string">&#x27;describe&#x27;</span>: [<span class="hljs-string">&#x27;collection&#x27;</span>, <span class="hljs-string">&#x27;partition&#x27;</span>],
        <span class="hljs-string">&#x27;exit&#x27;</span>: [],
        <span class="hljs-string">&#x27;help&#x27;</span>: [],
        <span class="hljs-string">&#x27;import&#x27;</span>: [],
        <span class="hljs-string">&#x27;list&#x27;</span>: [<span class="hljs-string">&#x27;collections&#x27;</span>, <span class="hljs-string">&#x27;partitions&#x27;</span>, <span class="hljs-string">&#x27;indexes&#x27;</span>],
        <span class="hljs-string">&#x27;load&#x27;</span>: [],
        <span class="hljs-string">&#x27;query&#x27;</span>: [],
        <span class="hljs-string">&#x27;release&#x27;</span>: [],
        <span class="hljs-string">&#x27;search&#x27;</span>: [],
        <span class="hljs-string">&#x27;show&#x27;</span>: [<span class="hljs-string">&#x27;connection&#x27;</span>, <span class="hljs-string">&#x27;index_progress&#x27;</span>, <span class="hljs-string">&#x27;loading_progress&#x27;</span>],
        <span class="hljs-string">&#x27;version&#x27;</span>: [],
    }

    <span class="hljs-keyword">def</span> <span class="hljs-title function_">__init__</span>(<span class="hljs-params">self</span>) -&gt; <span class="hljs-literal">None</span>:
        <span class="hljs-built_in">super</span>().__init__()
        <span class="hljs-variable language_">self</span>.COMMANDS = <span class="hljs-built_in">list</span>(<span class="hljs-variable language_">self</span>.CMDS_DICT.keys())
        <span class="hljs-variable language_">self</span>.createCompleteFuncs(<span class="hljs-variable language_">self</span>.CMDS_DICT)

    <span class="hljs-keyword">def</span> <span class="hljs-title function_">createCompleteFuncs</span>(<span class="hljs-params">self, cmdDict</span>):
        <span class="hljs-keyword">for</span> cmd <span class="hljs-keyword">in</span> cmdDict:
            sub_cmds = cmdDict[cmd]
            complete_example = <span class="hljs-variable language_">self</span>.makeComplete(cmd, sub_cmds)
            <span class="hljs-built_in">setattr</span>(<span class="hljs-variable language_">self</span>, <span class="hljs-string">&#x27;complete_%s&#x27;</span> % cmd, complete_example)

    <span class="hljs-keyword">def</span> <span class="hljs-title function_">makeComplete</span>(<span class="hljs-params">self, cmd, sub_cmds</span>):
        <span class="hljs-keyword">def</span> <span class="hljs-title function_">f_complete</span>(<span class="hljs-params">args</span>):
            <span class="hljs-string">f&quot;Completions for the <span class="hljs-subst">{cmd}</span> command.&quot;</span>
            <span class="hljs-keyword">if</span> <span class="hljs-keyword">not</span> args:
                <span class="hljs-keyword">return</span> <span class="hljs-variable language_">self</span>._complete_path(<span class="hljs-string">&#x27;.&#x27;</span>)
            <span class="hljs-keyword">if</span> <span class="hljs-built_in">len</span>(args) &lt;= <span class="hljs-number">1</span> <span class="hljs-keyword">and</span> <span class="hljs-keyword">not</span> cmd == <span class="hljs-string">&#x27;import&#x27;</span>:
                <span class="hljs-keyword">return</span> <span class="hljs-variable language_">self</span>._complete_2nd_level(sub_cmds, args[-<span class="hljs-number">1</span>])
            <span class="hljs-keyword">return</span> <span class="hljs-variable language_">self</span>._complete_path(args[-<span class="hljs-number">1</span>])
        <span class="hljs-keyword">return</span> f_complete

    <span class="hljs-keyword">def</span> <span class="hljs-title function_">_listdir</span>(<span class="hljs-params">self, root</span>):
        <span class="hljs-string">&quot;List directory &#x27;root&#x27; appending the path separator to subdirs.&quot;</span>
        res = []
        <span class="hljs-keyword">for</span> name <span class="hljs-keyword">in</span> os.listdir(root):
            path = os.path.join(root, name)
            <span class="hljs-keyword">if</span> os.path.isdir(path):
                name += os.sep
            res.append(name)
        <span class="hljs-keyword">return</span> res

    <span class="hljs-keyword">def</span> <span class="hljs-title function_">_complete_path</span>(<span class="hljs-params">self, path=<span class="hljs-literal">None</span></span>):
        <span class="hljs-string">&quot;Perform completion of filesystem path.&quot;</span>
        <span class="hljs-keyword">if</span> <span class="hljs-keyword">not</span> path:
            <span class="hljs-keyword">return</span> <span class="hljs-variable language_">self</span>._listdir(<span class="hljs-string">&#x27;.&#x27;</span>)
        dirname, rest = os.path.split(path)
        tmp = dirname <span class="hljs-keyword">if</span> dirname <span class="hljs-keyword">else</span> <span class="hljs-string">&#x27;.&#x27;</span>
        res = [os.path.join(dirname, p)
               <span class="hljs-keyword">for</span> p <span class="hljs-keyword">in</span> <span class="hljs-variable language_">self</span>._listdir(tmp) <span class="hljs-keyword">if</span> p.startswith(rest)]
        <span class="hljs-comment"># more than one match, or single match which does not exist (typo)</span>
        <span class="hljs-keyword">if</span> <span class="hljs-built_in">len</span>(res) &gt; <span class="hljs-number">1</span> <span class="hljs-keyword">or</span> <span class="hljs-keyword">not</span> os.path.exists(path):
            <span class="hljs-keyword">return</span> res
        <span class="hljs-comment"># resolved to a single directory, so return list of files below it</span>
        <span class="hljs-keyword">if</span> os.path.isdir(path):
            <span class="hljs-keyword">return</span> [os.path.join(path, p) <span class="hljs-keyword">for</span> p <span class="hljs-keyword">in</span> <span class="hljs-variable language_">self</span>._listdir(path)]
        <span class="hljs-comment"># exact file match terminates this completion</span>
        <span class="hljs-keyword">return</span> [path + <span class="hljs-string">&#x27; &#x27;</span>]

    <span class="hljs-keyword">def</span> <span class="hljs-title function_">_complete_2nd_level</span>(<span class="hljs-params">self, SUB_COMMANDS=[], cmd=<span class="hljs-literal">None</span></span>):
        <span class="hljs-keyword">if</span> <span class="hljs-keyword">not</span> cmd:
            <span class="hljs-keyword">return</span> [c + <span class="hljs-string">&#x27; &#x27;</span> <span class="hljs-keyword">for</span> c <span class="hljs-keyword">in</span> SUB_COMMANDS]
        res = [c <span class="hljs-keyword">for</span> c <span class="hljs-keyword">in</span> SUB_COMMANDS <span class="hljs-keyword">if</span> c.startswith(cmd)]
        <span class="hljs-keyword">if</span> <span class="hljs-built_in">len</span>(res) &gt; <span class="hljs-number">1</span> <span class="hljs-keyword">or</span> <span class="hljs-keyword">not</span> (cmd <span class="hljs-keyword">in</span> SUB_COMMANDS):
            <span class="hljs-keyword">return</span> res
        <span class="hljs-keyword">return</span> [cmd + <span class="hljs-string">&#x27; &#x27;</span>]

    <span class="hljs-keyword">def</span> <span class="hljs-title function_">complete</span>(<span class="hljs-params">self, text, state</span>):
        <span class="hljs-string">&quot;Generic readline completion entry point.&quot;</span>
        buffer = readline.get_line_buffer()
        line = readline.get_line_buffer().split()
        <span class="hljs-comment"># show all commands</span>
        <span class="hljs-keyword">if</span> <span class="hljs-keyword">not</span> line:
            <span class="hljs-keyword">return</span> [c + <span class="hljs-string">&#x27; &#x27;</span> <span class="hljs-keyword">for</span> c <span class="hljs-keyword">in</span> <span class="hljs-variable language_">self</span>.COMMANDS][state]
        <span class="hljs-comment"># account for last argument ending in a space</span>
        <span class="hljs-keyword">if</span> <span class="hljs-variable language_">self</span>.RE_SPACE.<span class="hljs-keyword">match</span>(buffer):
            line.append(<span class="hljs-string">&#x27;&#x27;</span>)
        <span class="hljs-comment"># resolve command to the implementation function</span>
        cmd = line[<span class="hljs-number">0</span>].strip()
        <span class="hljs-keyword">if</span> cmd <span class="hljs-keyword">in</span> <span class="hljs-variable language_">self</span>.COMMANDS:
            impl = <span class="hljs-built_in">getattr</span>(<span class="hljs-variable language_">self</span>, <span class="hljs-string">&#x27;complete_%s&#x27;</span> % cmd)
            args = line[<span class="hljs-number">1</span>:]
            <span class="hljs-keyword">if</span> args:
                <span class="hljs-keyword">return</span> (impl(args) + [<span class="hljs-literal">None</span>])[state]
            <span class="hljs-keyword">return</span> [cmd + <span class="hljs-string">&#x27; &#x27;</span>][state]
        results = [
            c + <span class="hljs-string">&#x27; &#x27;</span> <span class="hljs-keyword">for</span> c <span class="hljs-keyword">in</span> <span class="hljs-variable language_">self</span>.COMMANDS <span class="hljs-keyword">if</span> c.startswith(cmd)] + [<span class="hljs-literal">None</span>]
        <span class="hljs-keyword">return</span> results[state]
<button class="copy-code-btn"></button></code></pre>
<p>定義<code translate="no">Completer</code> 之後，我們可以將它與 readline 綁定：</p>
<pre><code translate="no" class="language-python">comp = Completer()


<span class="hljs-keyword">def</span> <span class="hljs-title function_">runCliPrompt</span>():
    <span class="hljs-keyword">try</span>:
        <span class="hljs-keyword">while</span> <span class="hljs-keyword">not</span> quitapp:
            <span class="hljs-keyword">import</span> readline
            readline.set_completer_delims(<span class="hljs-string">&#x27; \t\n;&#x27;</span>)
            readline.parse_and_bind(<span class="hljs-string">&quot;tab: complete&quot;</span>)
            readline.set_completer(comp.complete)
            astr = <span class="hljs-built_in">input</span>(<span class="hljs-string">&#x27;milvus_cli &gt; &#x27;</span>)
            <span class="hljs-keyword">try</span>:
                cli(astr.split())
            <span class="hljs-keyword">except</span> SystemExit:
                <span class="hljs-comment"># trap argparse error message</span>
                <span class="hljs-comment"># print(&#x27;error&#x27;, SystemExit)</span>
                <span class="hljs-keyword">continue</span>
    <span class="hljs-keyword">except</span> KeyboardInterrupt:
        sys.exit(<span class="hljs-number">0</span>)
<button class="copy-code-btn"></button></code></pre>
<h2 id="Add-one-time-option" class="common-anchor-header">新增一次性選項<button data-href="#Add-one-time-option" class="anchor-icon" translate="no">
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
    </button></h2><p>對於提示命令列，有時我們不想完全執行腳本來取得一些資訊，例如版本。一個很好的例子是<code translate="no">Python</code> ，當您在終端輸入<code translate="no">python</code> 時，promtp 指令行會顯示，但它只會回傳版本資訊，如果您輸入<code translate="no">python -V</code> ，它不會進入提示指令碼。所以我們可以在程式碼中使用<code translate="no">sys.args</code> 來實現。</p>
<pre><code translate="no" class="language-python"><span class="hljs-keyword">def</span> <span class="hljs-title function_">runCliPrompt</span>():
    args = sys.argv
    <span class="hljs-keyword">if</span> args <span class="hljs-keyword">and</span> (args[-<span class="hljs-number">1</span>] == <span class="hljs-string">&#x27;--version&#x27;</span>):
        <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Milvus Cli v<span class="hljs-subst">{getPackageVersion()}</span>&quot;</span>)
        <span class="hljs-keyword">return</span>
    <span class="hljs-keyword">try</span>:
        <span class="hljs-keyword">while</span> <span class="hljs-keyword">not</span> quitapp:
            <span class="hljs-keyword">import</span> readline
            readline.set_completer_delims(<span class="hljs-string">&#x27; \t\n;&#x27;</span>)
            readline.parse_and_bind(<span class="hljs-string">&quot;tab: complete&quot;</span>)
            readline.set_completer(comp.complete)
            astr = <span class="hljs-built_in">input</span>(<span class="hljs-string">&#x27;milvus_cli &gt; &#x27;</span>)
            <span class="hljs-keyword">try</span>:
                cli(astr.split())
            <span class="hljs-keyword">except</span> SystemExit:
                <span class="hljs-comment"># trap argparse error message</span>
                <span class="hljs-comment"># print(&#x27;error&#x27;, SystemExit)</span>
                <span class="hljs-keyword">continue</span>
    <span class="hljs-keyword">except</span> KeyboardInterrupt:
        sys.exit(<span class="hljs-number">0</span>)


<span class="hljs-keyword">if</span> __name__ == <span class="hljs-string">&#x27;__main__&#x27;</span>:
    runCliPrompt()
<button class="copy-code-btn"></button></code></pre>
<p>當第一次運行到 CLI 腳本時，我們會在循環之前得到<code translate="no">sys.args</code> 。如果最後一個參數是<code translate="no">--version</code> ，程式碼會返回套件版本，而不會進入循環。</p>
<p>在我們將代碼建立為套件之後，這將會很有幫助。使用者可以輸入<code translate="no">milvus_cli</code> 跳到提示 CLI，或輸入<code translate="no">milvus_cli --version</code> 只取得版本。</p>
<h2 id="Build-and-release" class="common-anchor-header">建立與釋出<button data-href="#Build-and-release" class="anchor-icon" translate="no">
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
    </button></h2><p>最後，我們要建立套件並透過 PYPI 發佈。這樣使用者就可以簡單地使用<code translate="no">pip install &lt;package name&gt;</code> 來安裝。</p>
<h3 id="Install-locally-for-test" class="common-anchor-header">本機安裝測試</h3><p>在您將軟體包發佈到PYPI之前，您可能想要在本機安裝進行一些測試。</p>
<p>在這種情況下，您只需<code translate="no">cd</code> 到套件目錄，然後執行<code translate="no">pip install -e .</code> (別忘了<code translate="no">.</code>)。</p>
<h3 id="Create-package-files" class="common-anchor-header">建立套件檔案</h3><p>參考：https://packaging.python.org/tutorials/packaging-projects/</p>
<p>套件的結構應該如下</p>
<pre><code translate="no" class="language-shell">package_example/
├── LICENSE
├── README.md
├── setup.py
├── src/
│   ├── __init__.py
│   ├── main.py
│   └── scripts/
│       ├── __init__.py
│       └── example.py
└── tests/
<button class="copy-code-btn"></button></code></pre>
<h4 id="Create-the-package-directory" class="common-anchor-header">建立套件目錄</h4><p>建立<code translate="no">Milvus_cli</code> 目錄，結構如下：</p>
<pre><code translate="no" class="language-shell">Milvus_cli/
├── LICENSE
├── README.md
├── setup.py
├── milvus_cli/
│   ├── __init__.py
│   ├── main.py
│   ├── utils.py
│   └── scripts/
│       ├── __init__.py
│       └── milvus_cli.py
└── dist/
<button class="copy-code-btn"></button></code></pre>
<h4 id="Write-the-entry-code" class="common-anchor-header">寫入程式碼</h4><p>腳本的入口應該在<code translate="no">Milvus_cli/milvus_cli/scripts</code> ，而<code translate="no">Milvus_cli/milvus_cli/scripts/milvus_cli.py</code> 應該像這樣：</p>
<pre><code translate="no" class="language-python"><span class="hljs-keyword">import</span> sys
<span class="hljs-keyword">import</span> os
<span class="hljs-keyword">import</span> click
<span class="hljs-keyword">from</span> utils <span class="hljs-keyword">import</span> PyOrm, Completer


pass_context = click.make_pass_decorator(PyOrm, ensure=<span class="hljs-literal">True</span>)


<span class="hljs-meta">@click.group(<span class="hljs-params">no_args_is_help=<span class="hljs-literal">False</span>, add_help_option=<span class="hljs-literal">False</span>, invoke_without_command=<span class="hljs-literal">True</span></span>)</span>
<span class="hljs-meta">@click.pass_context</span>
<span class="hljs-keyword">def</span> <span class="hljs-title function_">cli</span>(<span class="hljs-params">ctx</span>):
    <span class="hljs-string">&quot;&quot;&quot;Milvus CLI&quot;&quot;&quot;</span>
    ctx.obj = PyOrm()

<span class="hljs-string">&quot;&quot;&quot;
...
Here your code.
...
&quot;&quot;&quot;</span>

<span class="hljs-meta">@cli.command(<span class="hljs-params"><span class="hljs-string">&#x27;exit&#x27;</span></span>)</span>
<span class="hljs-keyword">def</span> <span class="hljs-title function_">quitapp</span>():
    <span class="hljs-string">&quot;&quot;&quot;Exit the CLI.&quot;&quot;&quot;</span>
    <span class="hljs-keyword">global</span> quitapp
    quitapp = <span class="hljs-literal">True</span>


quitapp = <span class="hljs-literal">False</span>  <span class="hljs-comment"># global flag</span>
comp = Completer()


<span class="hljs-keyword">def</span> <span class="hljs-title function_">runCliPrompt</span>():
    args = sys.argv
    <span class="hljs-keyword">if</span> args <span class="hljs-keyword">and</span> (args[-<span class="hljs-number">1</span>] == <span class="hljs-string">&#x27;--version&#x27;</span>):
        <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Milvus Cli v<span class="hljs-subst">{getPackageVersion()}</span>&quot;</span>)
        <span class="hljs-keyword">return</span>
    <span class="hljs-keyword">try</span>:
        <span class="hljs-keyword">while</span> <span class="hljs-keyword">not</span> quitapp:
            <span class="hljs-keyword">import</span> readline
            readline.set_completer_delims(<span class="hljs-string">&#x27; \t\n;&#x27;</span>)
            readline.parse_and_bind(<span class="hljs-string">&quot;tab: complete&quot;</span>)
            readline.set_completer(comp.complete)
            astr = <span class="hljs-built_in">input</span>(<span class="hljs-string">&#x27;milvus_cli &gt; &#x27;</span>)
            <span class="hljs-keyword">try</span>:
                cli(astr.split())
            <span class="hljs-keyword">except</span> SystemExit:
                <span class="hljs-comment"># trap argparse error message</span>
                <span class="hljs-comment"># print(&#x27;error&#x27;, SystemExit)</span>
                <span class="hljs-keyword">continue</span>
            <span class="hljs-keyword">except</span> Exception <span class="hljs-keyword">as</span> e:
                click.echo(
                    message=<span class="hljs-string">f&quot;Error occurred!\n<span class="hljs-subst">{<span class="hljs-built_in">str</span>(e)}</span>&quot;</span>, err=<span class="hljs-literal">True</span>)
    <span class="hljs-keyword">except</span> KeyboardInterrupt:
        sys.exit(<span class="hljs-number">0</span>)


<span class="hljs-keyword">if</span> __name__ == <span class="hljs-string">&#x27;__main__&#x27;</span>:
    runCliPrompt()
<button class="copy-code-btn"></button></code></pre>
<h4 id="Edit-the-setuppy" class="common-anchor-header">編輯<code translate="no">setup.py</code></h4><pre><code translate="no" class="language-python"><span class="hljs-keyword">from</span> setuptools <span class="hljs-keyword">import</span> setup, find_packages

<span class="hljs-keyword">with</span> <span class="hljs-built_in">open</span>(<span class="hljs-string">&quot;README.md&quot;</span>, <span class="hljs-string">&quot;r&quot;</span>, encoding=<span class="hljs-string">&quot;utf-8&quot;</span>) <span class="hljs-keyword">as</span> fh:
    long_description = fh.read()

setup(
    name=<span class="hljs-string">&#x27;milvus_cli&#x27;</span>,
    version=<span class="hljs-string">&#x27;0.1.6&#x27;</span>,
    author=<span class="hljs-string">&#x27;Milvus Team&#x27;</span>,
    author_email=<span class="hljs-string">&#x27;milvus-team@zilliz.com&#x27;</span>,
    url=<span class="hljs-string">&#x27;https://github.com/milvus-io/milvus_cli&#x27;</span>,
    description=<span class="hljs-string">&#x27;CLI for Milvus&#x27;</span>,
    long_description=long_description,
    long_description_content_type=<span class="hljs-string">&#x27;text/markdown&#x27;</span>,
    license=<span class="hljs-string">&#x27;Apache-2.0&#x27;</span>,
    packages=find_packages(),
    include_package_data=<span class="hljs-literal">True</span>,
    install_requires=[
        <span class="hljs-string">&#x27;Click==8.0.1&#x27;</span>,
        <span class="hljs-string">&#x27;pymilvus==2.0.0rc5&#x27;</span>,
        <span class="hljs-string">&#x27;tabulate==0.8.9&#x27;</span>
    ],
    entry_points={
        <span class="hljs-string">&#x27;console_scripts&#x27;</span>: [
            <span class="hljs-string">&#x27;milvus_cli = milvus_cli.scripts.milvus_cli:runCliPrompt&#x27;</span>,
        ],
    },
    python_requires=<span class="hljs-string">&#x27;&gt;=3.8&#x27;</span>
)
<button class="copy-code-btn"></button></code></pre>
<p>這裡有些提示：</p>
<ol>
<li>我們使用<code translate="no">README.md</code> 的內容做為套件的長描述。</li>
<li>將所有相依性加入<code translate="no">install_requires</code> 。</li>
<li>指定<code translate="no">entry_points</code> 。在本例中，我們將<code translate="no">milvus_cli</code> 設定為<code translate="no">console_scripts</code> 的子代，這樣我們就可以在安裝此套件後直接輸入<code translate="no">milvus_cli</code> 作為命令。而<code translate="no">milvus_cli</code> 的入口點是<code translate="no">milvus_cli/scripts/milvus_cli.py</code> 中的<code translate="no">runCliPrompt</code> 函式。</li>
</ol>
<h4 id="Build" class="common-anchor-header">建立</h4><ol>
<li><p>升級<code translate="no">build</code> 套件：<code translate="no">python3 -m pip install --upgrade build</code></p></li>
<li><p>執行 build：<code translate="no">python -m build --sdist --wheel --outdir dist/ .</code></p></li>
<li><p>在<code translate="no">dist/</code> 目錄下會產生兩個檔案：</p></li>
</ol>
<pre><code translate="no" class="language-shell">dist/
  example_package_YOUR_USERNAME_HERE-<span class="hljs-number">0.0</span><span class="hljs-number">.1</span>-py3-none-<span class="hljs-built_in">any</span>.whl
  example_package_YOUR_USERNAME_HERE-<span class="hljs-number">0.0</span><span class="hljs-number">.1</span>.tar.gz
<button class="copy-code-btn"></button></code></pre>
<h3 id="Publish-release" class="common-anchor-header">發佈版本</h3><p>參考： https://packaging.python.org/tutorials/packaging-projects/#uploading-the-distribution-archives</p>
<ol>
<li>升級<code translate="no">twine</code> 套件：<code translate="no">python3 -m pip install --upgrade twine</code></li>
<li>上傳至<code translate="no">PYPI</code> test env：<code translate="no">python3 -m twine upload --repository testpypi dist/*</code></li>
<li>上傳至<code translate="no">PYPI</code> ：<code translate="no">python3 -m twine upload dist/*</code></li>
</ol>
<h3 id="CICD-by-Github-workflows" class="common-anchor-header">透過 Github 工作流程進行 CI/CD</h3><p>參考：https://packaging.python.org/guides/publishing-package-distribution-releases-using-github-actions-ci-cd-workflows/</p>
<p>我們想要一種自動上傳資產的方式，它可以建立套件並上傳到 github 發行版和PYPI。</p>
<p>(因為某些原因，我們只希望工作流程只將發行版發佈到PYPI測試)。</p>
<pre><code translate="no" class="language-yaml"><span class="hljs-comment"># This is a basic workflow to help you get started with Actions</span>

name: Update the release<span class="hljs-string">&#x27;s assets after it published

# Controls when the workflow will run
on:
  release:
    # The workflow will run after release published
    types: [published]

# A workflow run is made up of one or more jobs that can run sequentially or in parallel
jobs:
  # This workflow contains a single job called &quot;build&quot;
  build:
    # The type of runner that the job will run on
    runs-on: ubuntu-latest

    # Steps represent a sequence of tasks that will be executed as part of the job
    steps:
      # Checks-out your repository under $GITHUB_WORKSPACE, so your job can access it
      - uses: actions/checkout@v2
      - uses: actions/setup-python@v2
        with:
          python-version: &#x27;</span>3.8<span class="hljs-string">&#x27;
          architecture: &#x27;</span>x64<span class="hljs-string">&#x27;
      - name: Install pypa/build
        run: &gt;-
          python -m
          pip install
          build
          --user
      - name: Clean dist/
        run: |
          sudo rm -fr dist/*
      - name: Build a binary wheel and a source tarball
        run: &gt;-
          python -m
          build
          --sdist
          --wheel
          --outdir dist/
          .
      # Update target github release&#x27;</span>s assets
      - name: Update assets
        uses: softprops/action-gh-release@v1
        <span class="hljs-keyword">if</span>: startsWith(github.ref, <span class="hljs-string">&#x27;refs/tags/&#x27;</span>)
        with:
          files: ./dist/*
      - name: Publish distribution 📦 to Test PyPI
        <span class="hljs-keyword">if</span>: contains(github.ref, <span class="hljs-string">&#x27;beta&#x27;</span>) &amp;&amp; startsWith(github.ref, <span class="hljs-string">&#x27;refs/tags&#x27;</span>)
        uses: pypa/gh-action-pypi-publish@release/v1
        with:
          user: __token__
          password: <span class="hljs-variable">${{ secrets.TEST_PYPI_API_TOKEN }</span>}
          repository_url: https://test.pypi.org/legacy/
          packages_dir: dist/
          verify_metadata: <span class="hljs-literal">false</span>
<button class="copy-code-btn"></button></code></pre>
<h2 id="Learn-more-about-Milvus" class="common-anchor-header">進一步了解 Milvus<button data-href="#Learn-more-about-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 是一個強大的工具，能夠為大量的人工智慧和向量相似性搜尋應用提供動力。若要瞭解更多關於專案的資訊，請參閱下列資源：</p>
<ul>
<li>閱讀我們的<a href="https://milvus.io/blog">部落格</a>。</li>
<li>在<a href="https://milvusio.slack.com/join/shared_invite/zt-e0u4qu3k-bI2GDNys3ZqX1YCJ9OM~GQ#/shared-invite/email">Slack</a> 上與我們的開放原始碼社群互動。</li>
<li>在<a href="https://github.com/milvus-io/milvus/">GitHub</a> 上使用全球最受歡迎的向量資料庫，或為其做出貢獻。</li>
<li>使用我們新的<a href="https://github.com/milvus-io/bootcamp">bootcamp</a> 快速測試和部署 AI 應用程式。</li>
</ul>
