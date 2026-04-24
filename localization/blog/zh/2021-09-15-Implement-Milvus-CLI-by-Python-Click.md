---
id: Implement-Milvus-CLI-by-Python-Click.md
title: Overview
author: Zhen Chen
date: 2021-09-15T00:00:00.000Z
desc: Introduce how to implement a CLI based on Python Click.
tag: Engineering
isPublish: true
---
<custom-h1>Implement Milvus CLI by Python Click</custom-h1><ul>
<li><a href="#Implement-Milvus-CLI-by-Python-Click">Implement Milvus CLI by Python Click</a>
<ul>
<li><a href="#Overview">Overview</a></li>
<li><a href="#Group-commands">Group commands</a></li>
<li><a href="#Custom-a-command">Custom a command</a></li>
<li><a href="#Implement-prompt-cli-for-user-to-input">Implement prompt CLI for user to input</a></li>
<li><a href="#Manually-implement-autocomplete">Manually implement autocomplete</a></li>
<li><a href="#Add-one-time-option">Add one-time option</a></li>
<li><a href="#Build-and-release">Build and release</a></li>
<li><a href="#Learn-more-about-Milvus">Learn more about Milvus</a></li>
</ul></li>
</ul>
<h2 id="Overview" class="common-anchor-header">Overview<button data-href="#Overview" class="anchor-icon" translate="no">
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
    </button></h2><p>Project URL: https://github.com/milvus-io/milvus_cli</p>
<p>Preparation: <code translate="no">Python3.8</code>,<a href="https://click.palletsprojects.com/en/8.0.x/api/"> <code translate="no">Click 8.0.x</code></a></p>
<h2 id="Group-commands" class="common-anchor-header">Group commands<button data-href="#Group-commands" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Create-a-command" class="common-anchor-header">Create a command</h3><pre><code translate="no" class="language-python"><span class="hljs-keyword">import</span> click
<span class="hljs-keyword">from</span> utils <span class="hljs-keyword">import</span> PyOrm

<span class="hljs-meta">@click.group(<span class="hljs-params">no_args_is_help=<span class="hljs-literal">False</span>, add_help_option=<span class="hljs-literal">False</span>, invoke_without_command=<span class="hljs-literal">True</span></span>)</span>
<span class="hljs-meta">@click.pass_context</span>
<span class="hljs-keyword">def</span> <span class="hljs-title function_">cli</span>(<span class="hljs-params">ctx</span>):
    <span class="hljs-string">&quot;&quot;&quot;Milvus CLI&quot;&quot;&quot;</span>
    ctx.obj = PyOrm() <span class="hljs-comment"># PyOrm is a util class which wraps the milvus python SDK. You can pass any class instance here. Any command function passed by @click.obj can call it.</span>

<span class="hljs-keyword">if</span> __name__ == <span class="hljs-string">&#x27;__main__&#x27;</span>:
    cli()
<button class="copy-code-btn"></button></code></pre>
<p>As the code above, we use <code translate="no">@click.group()</code> to create a command group <code translate="no">cli</code> as entry point. To implement a prompt CLI we need to disable help messages for the entry, so we add <code translate="no">no_args_is_help=False</code>, <code translate="no">add_help_option=False</code> and <code translate="no">invoke_without_command=True</code>. And nothing will be printed if we input <code translate="no">cli</code> in terminal only.</p>
<p>Besides we use <code translate="no">@click.pass_context</code> to pass a context to this group for further usage.</p>
<h3 id="Create-a-sub-command-of-command-group" class="common-anchor-header">Create a sub command of command group</h3><p>Then we add the first sub command <code translate="no">help</code> under <code translate="no">cli</code>:</p>
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
<p>Now we can use <code translate="no">cli help</code> in terminal:</p>
<pre><code translate="no" class="language-shell">$ python milvus_cli/scripts/milvus_cli.py <span class="hljs-built_in">help</span>
<button class="copy-code-btn"></button></code></pre>
<h3 id="Create-a-sub-group-of-a-command-group" class="common-anchor-header">Create a sub group of a command group</h3><p>Not only we want to have a sub command like <code translate="no">cli help</code>, but also we need a sub group commands such as <code translate="no">cli list collection</code> , <code translate="no">cli list partition</code> and <code translate="no">cli list indexes</code>.</p>
<p>First we create a sub group command <code translate="no">list</code>, here we can pass the first parameter to <code translate="no">@cli.group</code> as the command name instead of use defult function name, so that we can reduce duplicated function names.</p>
<p>Attention here, we use <code translate="no">@cli.group()</code> instead of <code translate="no">@click.group</code> so that we create a sub group of origin group.</p>
<p>The we use <code translate="no">@click.pass_obj</code> to pass the <code translate="no">context.obj</code> to sub commands of this sub group.</p>
<pre><code translate="no" class="language-python"><span class="hljs-meta">@cli.group(<span class="hljs-params"><span class="hljs-string">&#x27;list&#x27;</span>, no_args_is_help=<span class="hljs-literal">False</span></span>)</span>
<span class="hljs-meta">@click.pass_obj</span>
<span class="hljs-keyword">def</span> <span class="hljs-title function_">listDetails</span>(<span class="hljs-params">obj</span>):
    <span class="hljs-string">&quot;&quot;&quot;List collections, partitions and indexes.&quot;&quot;&quot;</span>
    <span class="hljs-keyword">pass</span>
<button class="copy-code-btn"></button></code></pre>
<p>Then we add some sub commands into this sub group by <code translate="no">@listDetails.command()</code> (not <code translate="no">@cli.command()</code>). Here’s just an example, you can ignore the implement and we will discuss it later.</p>
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
<p>After all these complete, we have a miltigroup commands that look like:</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://user-images.githubusercontent.com/83751452/132306467-71d81e50-3d6c-4fbe-81fc-db7280cb4838.png" alt="image" class="doc-image" id="image" />
    <span>image</span>
  </span>
</p>
<h2 id="Custom-a-command" class="common-anchor-header">Custom a command<button data-href="#Custom-a-command" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Add-options" class="common-anchor-header">Add options</h3><p>You can add some options to a command which will be used like <code translate="no">cli --test-option value</code>.</p>
<p>Here’s an example, we add three options <code translate="no">alias</code>, <code translate="no">host</code> and <code translate="no">port</code> to specified an address to connect to Milvus.</p>
<p>First two parameters define the short and full option name, the third parameter defines the variable name, the <code translate="no">help</code> parameter specifies the short help message, the <code translate="no">default</code> parameter specifies the default value and the <code translate="no">type</code> specifies the value type.</p>
<p>And all options’ values will be passed into the function in order of definition.</p>
<pre><code translate="no" class="language-python"><span class="hljs-meta">@cli.command(<span class="hljs-params">no_args_is_help=<span class="hljs-literal">False</span></span>)</span>
<span class="hljs-meta">@click.option(<span class="hljs-params"><span class="hljs-string">&#x27;-a&#x27;</span>, <span class="hljs-string">&#x27;--alias&#x27;</span>, <span class="hljs-string">&#x27;alias&#x27;</span>, <span class="hljs-built_in">help</span>=<span class="hljs-string">&quot;Milvus link alias name, default is `default`.&quot;</span>, default=<span class="hljs-string">&#x27;default&#x27;</span>, <span class="hljs-built_in">type</span>=<span class="hljs-built_in">str</span></span>)</span>
<span class="hljs-meta">@click.option(<span class="hljs-params"><span class="hljs-string">&#x27;-h&#x27;</span>, <span class="hljs-string">&#x27;--host&#x27;</span>, <span class="hljs-string">&#x27;host&#x27;</span>, <span class="hljs-built_in">help</span>=<span class="hljs-string">&quot;Host name, default is `127.0.0.1`.&quot;</span>, default=<span class="hljs-string">&#x27;127.0.0.1&#x27;</span>, <span class="hljs-built_in">type</span>=<span class="hljs-built_in">str</span></span>)</span>
<span class="hljs-meta">@click.option(<span class="hljs-params"><span class="hljs-string">&#x27;-p&#x27;</span>, <span class="hljs-string">&#x27;--port&#x27;</span>, <span class="hljs-string">&#x27;port&#x27;</span>, <span class="hljs-built_in">help</span>=<span class="hljs-string">&quot;Port, default is `19530`.&quot;</span>, default=<span class="hljs-number">19530</span>, <span class="hljs-built_in">type</span>=<span class="hljs-built_in">int</span></span>)</span>
<span class="hljs-meta">@click.pass_obj</span>
<span class="hljs-keyword">def</span> <span class="hljs-title function_">connect</span>(<span class="hljs-params">obj, alias, host, port</span>):
    <span class="hljs-keyword">pass</span>
<button class="copy-code-btn"></button></code></pre>
<h3 id="Add-flag-options" class="common-anchor-header">Add flag options</h3><p>We use options above to pass a value, but some times we just need a flag as a boolean value.</p>
<p>As the example below, option <code translate="no">autoId</code> is a flag option and don’t pass any data to function, so we can use it like <code translate="no">cli create collection -c c_name -p p_name -a</code>.</p>
<pre><code translate="no" class="language-python"><span class="hljs-meta">@createDetails.command(<span class="hljs-params"><span class="hljs-string">&#x27;collection&#x27;</span></span>)</span>
<span class="hljs-meta">@click.option(<span class="hljs-params"><span class="hljs-string">&#x27;-c&#x27;</span>, <span class="hljs-string">&#x27;--collection-name&#x27;</span>, <span class="hljs-string">&#x27;collectionName&#x27;</span>, <span class="hljs-built_in">help</span>=<span class="hljs-string">&#x27;Collection name to be created.&#x27;</span>, default=<span class="hljs-string">&#x27;&#x27;</span></span>)</span>
<span class="hljs-meta">@click.option(<span class="hljs-params"><span class="hljs-string">&#x27;-p&#x27;</span>, <span class="hljs-string">&#x27;--schema-primary-field&#x27;</span>, <span class="hljs-string">&#x27;primaryField&#x27;</span>, <span class="hljs-built_in">help</span>=<span class="hljs-string">&#x27;Primary field name.&#x27;</span>, default=<span class="hljs-string">&#x27;&#x27;</span></span>)</span>
<span class="hljs-meta">@click.option(<span class="hljs-params"><span class="hljs-string">&#x27;-a&#x27;</span>, <span class="hljs-string">&#x27;--schema-auto-id&#x27;</span>, <span class="hljs-string">&#x27;autoId&#x27;</span>, <span class="hljs-built_in">help</span>=<span class="hljs-string">&#x27;Enable auto id.&#x27;</span>, default=<span class="hljs-literal">False</span>, is_flag=<span class="hljs-literal">True</span></span>)</span>
<span class="hljs-meta">@click.pass_obj</span>
<span class="hljs-keyword">def</span> <span class="hljs-title function_">createCollection</span>(<span class="hljs-params">obj, collectionName, primaryField, autoId, description, fields</span>):
    <span class="hljs-keyword">pass</span>
<button class="copy-code-btn"></button></code></pre>
<h3 id="Add-arguments" class="common-anchor-header">Add arguments</h3><p>In this project we replace all arguments usage with options usage. But we still introduce argument usage here. Different from options, argements are used like <code translate="no">cli COMMAND [OPTIONS] ARGUEMENTS</code>. If we convert the example above into arguements usage, it’ll be like this:</p>
<pre><code translate="no" class="language-python"><span class="hljs-meta">@createDetails.command(<span class="hljs-params"><span class="hljs-string">&#x27;collection&#x27;</span></span>)</span>
<span class="hljs-meta">@click.argument(<span class="hljs-params"><span class="hljs-string">&#x27;collectionName&#x27;</span></span>)</span>
<span class="hljs-meta">@click.option(<span class="hljs-params"><span class="hljs-string">&#x27;-p&#x27;</span>, <span class="hljs-string">&#x27;--schema-primary-field&#x27;</span>, <span class="hljs-string">&#x27;primaryField&#x27;</span>, <span class="hljs-built_in">help</span>=<span class="hljs-string">&#x27;Primary field name.&#x27;</span>, default=<span class="hljs-string">&#x27;&#x27;</span></span>)</span>
<span class="hljs-meta">@click.option(<span class="hljs-params"><span class="hljs-string">&#x27;-a&#x27;</span>, <span class="hljs-string">&#x27;--schema-auto-id&#x27;</span>, <span class="hljs-string">&#x27;autoId&#x27;</span>, <span class="hljs-built_in">help</span>=<span class="hljs-string">&#x27;Enable auto id.&#x27;</span>, default=<span class="hljs-literal">False</span>, is_flag=<span class="hljs-literal">True</span></span>)</span>
<span class="hljs-meta">@click.pass_obj</span>
<span class="hljs-keyword">def</span> <span class="hljs-title function_">createCollection</span>(<span class="hljs-params">obj, collectionName, primaryField, autoId, description, fields</span>):
    <span class="hljs-keyword">pass</span>
<button class="copy-code-btn"></button></code></pre>
<p>Then the usage should be <code translate="no">cli create collection c_name -p p_name -a</code>.</p>
<h3 id="Add-full-help-message" class="common-anchor-header">Add full help message</h3><p>As we define the short help message above, we can define the full help message in function:</p>
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
<p>The first block inside of the function is the help message which will be printed after we input <code translate="no">cli connect --help</code>.</p>
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
<h3 id="Add-confirm" class="common-anchor-header">Add confirm</h3><p>Sometimes we need user to confirm some action especially delete something. We can add <code translate="no">click.confirm</code> to pause and ask user to confirm:</p>
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
<p>As the example above, a confirm conversation will show like <code translate="no">Aborted!ant to continue? [y/N]:</code>.</p>
<h3 id="Add-prompts" class="common-anchor-header">Add prompts</h3><p>To implement prompts we juest need to add <code translate="no">click.prompt</code>.</p>
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
<p>The prompt will show when each <code translate="no">click.prompt</code>. We use a few prompts in series so that it’ll look like a continuously conversation. This ensure user will input the data in order we want. In this case we need user to choose a collection first, and we need to get all partitions under this collections, then show them to user to choose.</p>
<h3 id="Add-choices" class="common-anchor-header">Add choices</h3><p>Sometimes you want user just input the limited range/type of value, you can add <code translate="no">type=click.Choice([&lt;any&gt;])</code> to <code translate="no">click.prompt</code> , <code translate="no">click.options</code> and etc…</p>
<p>Such as,</p>
<pre><code translate="no" class="language-python">collectionName = click.prompt(
        <span class="hljs-string">&#x27;Collection name&#x27;</span>, <span class="hljs-built_in">type</span>=click.Choice([<span class="hljs-string">&#x27;collection_1&#x27;</span>, <span class="hljs-string">&#x27;collection_2&#x27;</span>]))
<button class="copy-code-btn"></button></code></pre>
<p>Then user can only input <code translate="no">collection_1</code> or <code translate="no">collection_2</code> , error will be raised if any other inputs.</p>
<h3 id="Add-clear-screen" class="common-anchor-header">Add clear screen</h3><p>You can use <code translate="no">click.clear()</code> to implement it.</p>
<pre><code translate="no" class="language-python"><span class="hljs-meta">@cli.command()</span>
<span class="hljs-keyword">def</span> <span class="hljs-title function_">clear</span>():
    <span class="hljs-string">&quot;&quot;&quot;Clear screen.&quot;&quot;&quot;</span>
    click.clear()
<button class="copy-code-btn"></button></code></pre>
<h3 id="Additional-tips" class="common-anchor-header">Additional tips</h3><ul>
<li>Default value is <code translate="no">None</code>, so it’s meaningless if you specified the default value as <code translate="no">None</code>. And default <code translate="no">None</code> will cause <code translate="no">click.prompt</code> continously show if you want to leave a value empty to jump over it.</li>
</ul>
<h2 id="Implement-prompt-CLI-for-user-to-input" class="common-anchor-header">Implement prompt CLI for user to input<button data-href="#Implement-prompt-CLI-for-user-to-input" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Why-prompt-CLI" class="common-anchor-header">Why prompt CLI</h3><p>For database operation, we need a continuously connection to a instance. If we use origin command line mode, the connection will be dropped after each command performed. We also want to store some data when using CLI, and clean them after exit.</p>
<h3 id="Implement" class="common-anchor-header">Implement</h3><ol>
<li>Use <code translate="no">while True</code> for continuously listening user’s input.</li>
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
<li>Use <code translate="no">input</code> only will cause <code translate="no">up</code>, <code translate="no">down</code>, <code translate="no">left</code>, <code translate="no">right</code> arrow keys, <code translate="no">tab</code> key and some other keys converted to Acsii string automatically. Besides history commands can not be read from session. So we add <code translate="no">readline</code> into <code translate="no">runCliPrompt</code> function.</li>
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
<li>Add <code translate="no">quit</code> CLI.</li>
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
<li>Catch <code translate="no">KeyboardInterrupt</code> error when use <code translate="no">ctrl C</code> to exit.</li>
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
<li>After all settled, the CLI now looks like:</li>
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
<h2 id="Manually-implement-autocomplete" class="common-anchor-header">Manually implement autocomplete<button data-href="#Manually-implement-autocomplete" class="anchor-icon" translate="no">
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
    </button></h2><p>Different from click’s shell autocomplete, our project wrap the command line and use a loop to get user’s input to implement a prompt command line. So we need to bind a completer to <code translate="no">readline</code>.</p>
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
<p>After define <code translate="no">Completer</code> we can bind it with readline:</p>
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
<h2 id="Add-one-time-option" class="common-anchor-header">Add one-time option<button data-href="#Add-one-time-option" class="anchor-icon" translate="no">
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
    </button></h2><p>For prompt command line, sometimes we don’t want to fully run into the scripts to get some informations such as version. A good example is <code translate="no">Python</code>, when you type <code translate="no">python</code> in terminal the promtp command line will show, but it only returns a version message and will not entry the prompt scripts if you type <code translate="no">python -V</code>. So we can use <code translate="no">sys.args</code> in our code to implement.</p>
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
<p>We get <code translate="no">sys.args</code> before the loop when first run into CLI scripts. If the last arguments is <code translate="no">--version</code> , the code will return the package version without running into loop.</p>
<p>It will be helpful after we build the codes as a package. User can type <code translate="no">milvus_cli</code> to jump into a prompt CLI, or type <code translate="no">milvus_cli --version</code> to only get the version.</p>
<h2 id="Build-and-release" class="common-anchor-header">Build and release<button data-href="#Build-and-release" class="anchor-icon" translate="no">
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
    </button></h2><p>Finally we want to build a package and release by PYPI. So that user can simply use <code translate="no">pip install &lt;package name&gt;</code> to install.</p>
<h3 id="Install-locally-for-test" class="common-anchor-header">Install locally for test</h3><p>Before you publish the package to PYPI, you may want to install it locally for some tests.</p>
<p>In this case, you can simply <code translate="no">cd</code> into the package directory and run <code translate="no">pip install -e .</code> (Don’t forget the <code translate="no">.</code>).</p>
<h3 id="Create-package-files" class="common-anchor-header">Create package files</h3><p>Refer to: https://packaging.python.org/tutorials/packaging-projects/</p>
<p>A package’s structure should look like:</p>
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
<h4 id="Create-the-package-directory" class="common-anchor-header">Create the package directory</h4><p>Create <code translate="no">Milvus_cli</code> directory with the structure below:</p>
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
<h4 id="Write-the-entry-code" class="common-anchor-header">Write the entry code</h4><p>The script’s entry should be in <code translate="no">Milvus_cli/milvus_cli/scripts</code>, and the <code translate="no">Milvus_cli/milvus_cli/scripts/milvus_cli.py</code> should be like:</p>
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
<h4 id="Edit-the-setuppy" class="common-anchor-header">Edit the <code translate="no">setup.py</code></h4><pre><code translate="no" class="language-python"><span class="hljs-keyword">from</span> setuptools <span class="hljs-keyword">import</span> setup, find_packages

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
<p>Some tips here:</p>
<ol>
<li>We use <code translate="no">README.md</code> content as the package’s long description.</li>
<li>Add all dependencies to <code translate="no">install_requires</code>.</li>
<li>Specify the <code translate="no">entry_points</code>. In this case, we set <code translate="no">milvus_cli</code> as a child of <code translate="no">console_scripts</code>, so that we can type <code translate="no">milvus_cli</code> as a command directly after we install this package. And the <code translate="no">milvus_cli</code>'s entry point is <code translate="no">runCliPrompt</code> function in <code translate="no">milvus_cli/scripts/milvus_cli.py</code>.</li>
</ol>
<h4 id="Build" class="common-anchor-header">Build</h4><ol>
<li><p>Upgrade the <code translate="no">build</code> package: <code translate="no">python3 -m pip install --upgrade build</code></p></li>
<li><p>Run build: <code translate="no">python -m build --sdist --wheel --outdir dist/ .</code></p></li>
<li><p>Two files will be generated under the <code translate="no">dist/</code> directory:</p></li>
</ol>
<pre><code translate="no" class="language-shell">dist/
  example_package_YOUR_USERNAME_HERE-<span class="hljs-number">0.0</span><span class="hljs-number">.1</span>-py3-none-<span class="hljs-built_in">any</span>.whl
  example_package_YOUR_USERNAME_HERE-<span class="hljs-number">0.0</span><span class="hljs-number">.1</span>.tar.gz
<button class="copy-code-btn"></button></code></pre>
<h3 id="Publish-release" class="common-anchor-header">Publish release</h3><p>Refer to: https://packaging.python.org/tutorials/packaging-projects/#uploading-the-distribution-archives</p>
<ol>
<li>Upgrade <code translate="no">twine</code> package: <code translate="no">python3 -m pip install --upgrade twine</code></li>
<li>Upload to <code translate="no">PYPI</code> test env: <code translate="no">python3 -m twine upload --repository testpypi dist/*</code></li>
<li>Upload to <code translate="no">PYPI</code> : <code translate="no">python3 -m twine upload dist/*</code></li>
</ol>
<h3 id="CICD-by-Github-workflows" class="common-anchor-header">CI/CD by Github workflows</h3><p>Refer to: https://packaging.python.org/guides/publishing-package-distribution-releases-using-github-actions-ci-cd-workflows/</p>
<p>We want a way to upload assets automatically, it can build the packages and upload them to github releases and PYPI.</p>
<p>(For some reason we just want the workflow only publish the release to test PYPI.)</p>
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
<h2 id="Learn-more-about-Milvus" class="common-anchor-header">Learn more about Milvus<button data-href="#Learn-more-about-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus is a powerful tool capable of powering a vast array of artificial intelligence and vector similarity search applications. To learn more about the project, check out the following resources:</p>
<ul>
<li>Read our <a href="https://milvus.io/blog">blog</a>.</li>
<li>Interact with our open-source community on <a href="https://milvusio.slack.com/join/shared_invite/zt-e0u4qu3k-bI2GDNys3ZqX1YCJ9OM~GQ#/shared-invite/email">Slack</a>.</li>
<li>Use or contribute to the world’s most popular vector database on <a href="https://github.com/milvus-io/milvus/">GitHub</a>.</li>
<li>Quickly test and deploy AI applications with our new <a href="https://github.com/milvus-io/bootcamp">bootcamp</a>.</li>
</ul>
