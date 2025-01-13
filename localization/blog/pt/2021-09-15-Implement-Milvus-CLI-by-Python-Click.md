---
id: Implement-Milvus-CLI-by-Python-Click.md
title: Visão geral do projeto
author: Zhen Chen
date: 2021-09-15T00:00:00.000Z
desc: Introduzir a forma de implementar um CLI baseado no Python Click.
tag: Engineering
isPublish: true
---
<custom-h1>Implementar o Milvus CLI através de Python Click</custom-h1><ul>
<li><a href="#Implement-Milvus-CLI-by-Python-Click">Implementar o Milvus CLI com Python Click</a><ul>
<li><a href="#Overview">Visão geral</a></li>
<li><a href="#Group-commands">Agrupar comandos</a></li>
<li><a href="#Custom-a-command">Personalizar um comando</a></li>
<li><a href="#Implement-prompt-cli-for-user-to-input">Implementar o prompt CLI para o utilizador introduzir dados</a></li>
<li><a href="#Manually-implement-autocomplete">Implementar manualmente o autocomplete</a></li>
<li><a href="#Add-one-time-option">Adicionar uma opção única</a></li>
<li><a href="#Build-and-release">Criar e lançar</a></li>
<li><a href="#Learn-more-about-Milvus">Saiba mais sobre o Milvus</a></li>
</ul></li>
</ul>
<h2 id="Overview" class="common-anchor-header">Visão geral do projeto<button data-href="#Overview" class="anchor-icon" translate="no">
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
    </button></h2><p>URL do projeto: https://github.com/milvus-io/milvus_cli</p>
<p>Preparação: <code translate="no">Python3.8</code>,<a href="https://click.palletsprojects.com/en/8.0.x/api/"> <code translate="no">Click 8.0.x</code></a></p>
<h2 id="Group-commands" class="common-anchor-header">Agrupar comandos<button data-href="#Group-commands" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Create-a-command" class="common-anchor-header">Criar um comando</h3><pre><code translate="no" class="language-python"><span class="hljs-keyword">import</span> click
<span class="hljs-keyword">from</span> utils <span class="hljs-keyword">import</span> PyOrm

<span class="hljs-meta">@click.group(<span class="hljs-params">no_args_is_help=<span class="hljs-literal">False</span>, add_help_option=<span class="hljs-literal">False</span>, invoke_without_command=<span class="hljs-literal">True</span></span>)</span>
<span class="hljs-meta">@click.pass_context</span>
<span class="hljs-keyword">def</span> <span class="hljs-title function_">cli</span>(<span class="hljs-params">ctx</span>):
    <span class="hljs-string">&quot;&quot;&quot;Milvus CLI&quot;&quot;&quot;</span>
    ctx.obj = PyOrm() <span class="hljs-comment"># PyOrm is a util class which wraps the milvus python SDK. You can pass any class instance here. Any command function passed by @click.obj can call it.</span>

<span class="hljs-keyword">if</span> __name__ == <span class="hljs-string">&#x27;__main__&#x27;</span>:
    cli()
<button class="copy-code-btn"></button></code></pre>
<p>Conforme o código acima, usamos <code translate="no">@click.group()</code> para criar um grupo de comandos <code translate="no">cli</code> como ponto de entrada. Para implementar um prompt CLI, precisamos de desativar as mensagens de ajuda para a entrada, por isso adicionamos <code translate="no">no_args_is_help=False</code>, <code translate="no">add_help_option=False</code> e <code translate="no">invoke_without_command=True</code>. E nada será impresso se introduzirmos <code translate="no">cli</code> apenas no terminal.</p>
<p>Além disso, utilizamos <code translate="no">@click.pass_context</code> para passar um contexto a este grupo para utilização posterior.</p>
<h3 id="Create-a-sub-command-of-command-group" class="common-anchor-header">Criar um subcomando do grupo de comandos</h3><p>De seguida, adicionamos o primeiro subcomando <code translate="no">help</code> em <code translate="no">cli</code>:</p>
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
<p>Agora podemos utilizar <code translate="no">cli help</code> no terminal:</p>
<pre><code translate="no" class="language-shell">$ python milvus_cli/scripts/milvus_cli.py <span class="hljs-built_in">help</span>
<button class="copy-code-btn"></button></code></pre>
<h3 id="Create-a-sub-group-of-a-command-group" class="common-anchor-header">Criar um subgrupo de um grupo de comandos</h3><p>Não só queremos ter um subcomando como <code translate="no">cli help</code>, mas também precisamos de um subgrupo de comandos como <code translate="no">cli list collection</code>, <code translate="no">cli list partition</code> e <code translate="no">cli list indexes</code>.</p>
<p>Em primeiro lugar, criamos um subgrupo de comandos <code translate="no">list</code>. Neste caso, podemos passar o primeiro parâmetro para <code translate="no">@cli.group</code> como nome do comando em vez de utilizar o nome da função predefinida, de modo a reduzir a duplicação de nomes de funções.</p>
<p>Atenção, aqui utilizamos <code translate="no">@cli.group()</code> em vez de <code translate="no">@click.group</code> para criar um subgrupo do grupo de origem.</p>
<p>Utilizamos <code translate="no">@click.pass_obj</code> para passar <code translate="no">context.obj</code> para os subcomandos deste subgrupo.</p>
<pre><code translate="no" class="language-python"><span class="hljs-meta">@cli.group(<span class="hljs-params"><span class="hljs-string">&#x27;list&#x27;</span>, no_args_is_help=<span class="hljs-literal">False</span></span>)</span>
<span class="hljs-meta">@click.pass_obj</span>
<span class="hljs-keyword">def</span> <span class="hljs-title function_">listDetails</span>(<span class="hljs-params">obj</span>):
    <span class="hljs-string">&quot;&quot;&quot;List collections, partitions and indexes.&quot;&quot;&quot;</span>
    <span class="hljs-keyword">pass</span>
<button class="copy-code-btn"></button></code></pre>
<p>Depois, adicionamos alguns subcomandos a este subgrupo através de <code translate="no">@listDetails.command()</code> (e não <code translate="no">@cli.command()</code>). Este é apenas um exemplo, pode ignorar a implementação e discuti-la-emos mais tarde.</p>
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
<p>Depois de tudo isto concluído, temos um miltigroup de comandos com o seguinte aspeto</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://user-images.githubusercontent.com/83751452/132306467-71d81e50-3d6c-4fbe-81fc-db7280cb4838.png" alt="image" class="doc-image" id="image" />
   </span> <span class="img-wrapper"> <span>imagem</span> </span></p>
<h2 id="Custom-a-command" class="common-anchor-header">Personalizar um comando<button data-href="#Custom-a-command" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Add-options" class="common-anchor-header">Adicionar opções</h3><p>É possível adicionar algumas opções a um comando que será utilizado como <code translate="no">cli --test-option value</code>.</p>
<p>Eis um exemplo: adicionamos três opções <code translate="no">alias</code>, <code translate="no">host</code> e <code translate="no">port</code> para especificar um endereço para ligação ao Milvus.</p>
<p>Os dois primeiros parâmetros definem o nome curto e completo da opção, o terceiro parâmetro define o nome da variável, o parâmetro <code translate="no">help</code> especifica a mensagem curta de ajuda, o parâmetro <code translate="no">default</code> especifica o valor predefinido e o parâmetro <code translate="no">type</code> especifica o tipo de valor.</p>
<p>E todos os valores das opções serão passados para a função por ordem de definição.</p>
<pre><code translate="no" class="language-python"><span class="hljs-meta">@cli.command(<span class="hljs-params">no_args_is_help=<span class="hljs-literal">False</span></span>)</span>
<span class="hljs-meta">@click.option(<span class="hljs-params"><span class="hljs-string">&#x27;-a&#x27;</span>, <span class="hljs-string">&#x27;--alias&#x27;</span>, <span class="hljs-string">&#x27;alias&#x27;</span>, <span class="hljs-built_in">help</span>=<span class="hljs-string">&quot;Milvus link alias name, default is `default`.&quot;</span>, default=<span class="hljs-string">&#x27;default&#x27;</span>, <span class="hljs-built_in">type</span>=<span class="hljs-built_in">str</span></span>)</span>
<span class="hljs-meta">@click.option(<span class="hljs-params"><span class="hljs-string">&#x27;-h&#x27;</span>, <span class="hljs-string">&#x27;--host&#x27;</span>, <span class="hljs-string">&#x27;host&#x27;</span>, <span class="hljs-built_in">help</span>=<span class="hljs-string">&quot;Host name, default is `127.0.0.1`.&quot;</span>, default=<span class="hljs-string">&#x27;127.0.0.1&#x27;</span>, <span class="hljs-built_in">type</span>=<span class="hljs-built_in">str</span></span>)</span>
<span class="hljs-meta">@click.option(<span class="hljs-params"><span class="hljs-string">&#x27;-p&#x27;</span>, <span class="hljs-string">&#x27;--port&#x27;</span>, <span class="hljs-string">&#x27;port&#x27;</span>, <span class="hljs-built_in">help</span>=<span class="hljs-string">&quot;Port, default is `19530`.&quot;</span>, default=<span class="hljs-number">19530</span>, <span class="hljs-built_in">type</span>=<span class="hljs-built_in">int</span></span>)</span>
<span class="hljs-meta">@click.pass_obj</span>
<span class="hljs-keyword">def</span> <span class="hljs-title function_">connect</span>(<span class="hljs-params">obj, alias, host, port</span>):
    <span class="hljs-keyword">pass</span>
<button class="copy-code-btn"></button></code></pre>
<h3 id="Add-flag-options" class="common-anchor-header">Adicionar opções de sinalização</h3><p>Utilizámos as opções acima para passar um valor, mas, por vezes, só precisamos de um sinalizador como um valor booleano.</p>
<p>Como no exemplo abaixo, a opção <code translate="no">autoId</code> é uma opção de sinalização e não passa quaisquer dados para a função, pelo que podemos utilizá-la como <code translate="no">cli create collection -c c_name -p p_name -a</code>.</p>
<pre><code translate="no" class="language-python"><span class="hljs-meta">@createDetails.command(<span class="hljs-params"><span class="hljs-string">&#x27;collection&#x27;</span></span>)</span>
<span class="hljs-meta">@click.option(<span class="hljs-params"><span class="hljs-string">&#x27;-c&#x27;</span>, <span class="hljs-string">&#x27;--collection-name&#x27;</span>, <span class="hljs-string">&#x27;collectionName&#x27;</span>, <span class="hljs-built_in">help</span>=<span class="hljs-string">&#x27;Collection name to be created.&#x27;</span>, default=<span class="hljs-string">&#x27;&#x27;</span></span>)</span>
<span class="hljs-meta">@click.option(<span class="hljs-params"><span class="hljs-string">&#x27;-p&#x27;</span>, <span class="hljs-string">&#x27;--schema-primary-field&#x27;</span>, <span class="hljs-string">&#x27;primaryField&#x27;</span>, <span class="hljs-built_in">help</span>=<span class="hljs-string">&#x27;Primary field name.&#x27;</span>, default=<span class="hljs-string">&#x27;&#x27;</span></span>)</span>
<span class="hljs-meta">@click.option(<span class="hljs-params"><span class="hljs-string">&#x27;-a&#x27;</span>, <span class="hljs-string">&#x27;--schema-auto-id&#x27;</span>, <span class="hljs-string">&#x27;autoId&#x27;</span>, <span class="hljs-built_in">help</span>=<span class="hljs-string">&#x27;Enable auto id.&#x27;</span>, default=<span class="hljs-literal">False</span>, is_flag=<span class="hljs-literal">True</span></span>)</span>
<span class="hljs-meta">@click.pass_obj</span>
<span class="hljs-keyword">def</span> <span class="hljs-title function_">createCollection</span>(<span class="hljs-params">obj, collectionName, primaryField, autoId, description, fields</span>):
    <span class="hljs-keyword">pass</span>
<button class="copy-code-btn"></button></code></pre>
<h3 id="Add-arguments" class="common-anchor-header">Adicionar argumentos</h3><p>Neste projeto, substituímos a utilização de todos os argumentos pela utilização de opções. Mas ainda introduzimos o uso de argumentos aqui. Diferente das opções, os argumentos são usados como <code translate="no">cli COMMAND [OPTIONS] ARGUEMENTS</code>. Se convertermos o exemplo acima na utilização de argumentos, será assim:</p>
<pre><code translate="no" class="language-python"><span class="hljs-meta">@createDetails.command(<span class="hljs-params"><span class="hljs-string">&#x27;collection&#x27;</span></span>)</span>
<span class="hljs-meta">@click.argument(<span class="hljs-params"><span class="hljs-string">&#x27;collectionName&#x27;</span></span>)</span>
<span class="hljs-meta">@click.option(<span class="hljs-params"><span class="hljs-string">&#x27;-p&#x27;</span>, <span class="hljs-string">&#x27;--schema-primary-field&#x27;</span>, <span class="hljs-string">&#x27;primaryField&#x27;</span>, <span class="hljs-built_in">help</span>=<span class="hljs-string">&#x27;Primary field name.&#x27;</span>, default=<span class="hljs-string">&#x27;&#x27;</span></span>)</span>
<span class="hljs-meta">@click.option(<span class="hljs-params"><span class="hljs-string">&#x27;-a&#x27;</span>, <span class="hljs-string">&#x27;--schema-auto-id&#x27;</span>, <span class="hljs-string">&#x27;autoId&#x27;</span>, <span class="hljs-built_in">help</span>=<span class="hljs-string">&#x27;Enable auto id.&#x27;</span>, default=<span class="hljs-literal">False</span>, is_flag=<span class="hljs-literal">True</span></span>)</span>
<span class="hljs-meta">@click.pass_obj</span>
<span class="hljs-keyword">def</span> <span class="hljs-title function_">createCollection</span>(<span class="hljs-params">obj, collectionName, primaryField, autoId, description, fields</span>):
    <span class="hljs-keyword">pass</span>
<button class="copy-code-btn"></button></code></pre>
<p>Então a utilização deve ser <code translate="no">cli create collection c_name -p p_name -a</code>.</p>
<h3 id="Add-full-help-message" class="common-anchor-header">Adicionar mensagem de ajuda completa</h3><p>Tal como definimos a mensagem de ajuda curta acima, podemos definir a mensagem de ajuda completa na função:</p>
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
<p>O primeiro bloco dentro da função é a mensagem de ajuda que será impressa depois de introduzirmos <code translate="no">cli connect --help</code>.</p>
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
<h3 id="Add-confirm" class="common-anchor-header">Adicionar confirmação</h3><p>Por vezes, precisamos que o utilizador confirme uma ação, especialmente a eliminação de algo. Podemos adicionar <code translate="no">click.confirm</code> para fazer uma pausa e pedir ao utilizador para confirmar:</p>
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
<p>Como no exemplo acima, uma conversa de confirmação será apresentada como <code translate="no">Aborted!ant to continue? [y/N]:</code>.</p>
<h3 id="Add-prompts" class="common-anchor-header">Adicionar prompts</h3><p>Para implementar avisos, só precisamos de adicionar <code translate="no">click.prompt</code>.</p>
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
<p>O aviso será apresentado quando cada <code translate="no">click.prompt</code>. Utilizamos alguns prompts em série para que pareça uma conversa contínua. Isto garante que o utilizador introduzirá os dados pela ordem pretendida. Neste caso, é necessário que o utilizador escolha primeiro uma coleção e que obtenha todas as partições desta coleção e, em seguida, mostre-as ao utilizador para que este as escolha.</p>
<h3 id="Add-choices" class="common-anchor-header">Adicionar escolhas</h3><p>Por vezes, se o utilizador quiser introduzir apenas um intervalo/tipo de valor limitado, pode adicionar <code translate="no">type=click.Choice([&lt;any&gt;])</code> a <code translate="no">click.prompt</code>, <code translate="no">click.options</code> e etc...</p>
<p>Por exemplo,</p>
<pre><code translate="no" class="language-python">collectionName = click.prompt(
        <span class="hljs-string">&#x27;Collection name&#x27;</span>, <span class="hljs-built_in">type</span>=click.Choice([<span class="hljs-string">&#x27;collection_1&#x27;</span>, <span class="hljs-string">&#x27;collection_2&#x27;</span>]))
<button class="copy-code-btn"></button></code></pre>
<p>Assim, o utilizador só pode introduzir <code translate="no">collection_1</code> ou <code translate="no">collection_2</code>. Se introduzir outros valores, surgirá um erro.</p>
<h3 id="Add-clear-screen" class="common-anchor-header">Adicionar ecrã limpo</h3><p>Pode utilizar <code translate="no">click.clear()</code> para o implementar.</p>
<pre><code translate="no" class="language-python"><span class="hljs-meta">@cli.command()</span>
<span class="hljs-keyword">def</span> <span class="hljs-title function_">clear</span>():
    <span class="hljs-string">&quot;&quot;&quot;Clear screen.&quot;&quot;&quot;</span>
    click.clear()
<button class="copy-code-btn"></button></code></pre>
<h3 id="Additional-tips" class="common-anchor-header">Sugestões adicionais</h3><ul>
<li>O valor predefinido é <code translate="no">None</code>, pelo que não faz sentido se especificar o valor predefinido como <code translate="no">None</code>. E o valor predefinido <code translate="no">None</code> fará com que <code translate="no">click.prompt</code> apareça continuamente se quiser deixar um valor vazio para o ultrapassar.</li>
</ul>
<h2 id="Implement-prompt-CLI-for-user-to-input" class="common-anchor-header">Implementar um prompt CLI para o utilizador introduzir dados<button data-href="#Implement-prompt-CLI-for-user-to-input" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Why-prompt-CLI" class="common-anchor-header">Porquê um prompt CLI</h3><p>Para o funcionamento da base de dados, precisamos de uma ligação contínua a uma instância. Se utilizarmos o modo de linha de comandos de origem, a ligação será interrompida após cada comando executado. Também queremos armazenar alguns dados quando usamos o CLI, e limpá-los depois de sair.</p>
<h3 id="Implement" class="common-anchor-header">Implementar</h3><ol>
<li>Use <code translate="no">while True</code> para ouvir continuamente a entrada do utilizador.</li>
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
<li>Usar apenas <code translate="no">input</code> fará com que as teclas de seta <code translate="no">up</code>, <code translate="no">down</code>, <code translate="no">left</code>, <code translate="no">right</code>, a tecla <code translate="no">tab</code> e algumas outras teclas sejam convertidas em string Acsii automaticamente. Além disso, os comandos do histórico não podem ser lidos da sessão. Portanto, adicionamos <code translate="no">readline</code> à função <code translate="no">runCliPrompt</code>.</li>
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
<li>Adicionar <code translate="no">quit</code> CLI.</li>
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
<li>Pegar o erro <code translate="no">KeyboardInterrupt</code> quando usar <code translate="no">ctrl C</code> para sair.</li>
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
<li>Depois de tudo resolvido, a CLI agora se parece com:</li>
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
<h2 id="Manually-implement-autocomplete" class="common-anchor-header">Implementar manualmente o autocomplete<button data-href="#Manually-implement-autocomplete" class="anchor-icon" translate="no">
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
    </button></h2><p>Diferente do autocomplete do shell do click, nosso projeto envolve a linha de comando e usa um loop para obter a entrada do usuário para implementar uma linha de comando rápida. Portanto, precisamos vincular um complemento a <code translate="no">readline</code>.</p>
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
<p>Depois de definir <code translate="no">Completer</code>, podemos associá-lo ao readline:</p>
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
<h2 id="Add-one-time-option" class="common-anchor-header">Adicionar opção única<button data-href="#Add-one-time-option" class="anchor-icon" translate="no">
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
    </button></h2><p>Para a linha de comando de prompt, às vezes não queremos executar completamente os scripts para obter algumas informações, como a versão. Um bom exemplo é <code translate="no">Python</code>, quando digitamos <code translate="no">python</code> no terminal, a linha de comando promtp será exibida, mas só retorna uma mensagem de versão e não entrará nos scripts do prompt se digitarmos <code translate="no">python -V</code>. Assim, podemos utilizar <code translate="no">sys.args</code> no nosso código para implementar.</p>
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
<p>Obtemos <code translate="no">sys.args</code> antes do loop quando corremos pela primeira vez para os scripts CLI. Se os últimos argumentos forem <code translate="no">--version</code>, o código devolverá a versão do pacote sem entrar no ciclo.</p>
<p>Será útil depois de construirmos os códigos como um pacote. O utilizador pode escrever <code translate="no">milvus_cli</code> para saltar para um prompt CLI, ou escrever <code translate="no">milvus_cli --version</code> para obter apenas a versão.</p>
<h2 id="Build-and-release" class="common-anchor-header">Construir e lançar<button data-href="#Build-and-release" class="anchor-icon" translate="no">
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
    </button></h2><p>Finalmente queremos construir um pacote e liberar pelo PYPI. Assim, o usuário pode simplesmente usar <code translate="no">pip install &lt;package name&gt;</code> para instalar.</p>
<h3 id="Install-locally-for-test" class="common-anchor-header">Instalar localmente para teste</h3><p>Antes de publicar o pacote no PYPI, pode-se querer instalá-lo localmente para alguns testes.</p>
<p>Neste caso, pode simplesmente <code translate="no">cd</code> no diretório do pacote e correr <code translate="no">pip install -e .</code> (Não esquecer <code translate="no">.</code>).</p>
<h3 id="Create-package-files" class="common-anchor-header">Criar ficheiros de pacote</h3><p>Consulte: https://packaging.python.org/tutorials/packaging-projects/</p>
<p>A estrutura de um pacote deve ser semelhante:</p>
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
<h4 id="Create-the-package-directory" class="common-anchor-header">Criar o diretório do pacote</h4><p>Crie o diretório <code translate="no">Milvus_cli</code> com a estrutura abaixo:</p>
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
<h4 id="Write-the-entry-code" class="common-anchor-header">Escrever o código de entrada</h4><p>A entrada do script deve estar em <code translate="no">Milvus_cli/milvus_cli/scripts</code>, e o <code translate="no">Milvus_cli/milvus_cli/scripts/milvus_cli.py</code> deve ser como:</p>
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
<h4 id="Edit-the-setuppy" class="common-anchor-header">Editar o diretório <code translate="no">setup.py</code></h4><pre><code translate="no" class="language-python"><span class="hljs-keyword">from</span> setuptools <span class="hljs-keyword">import</span> setup, find_packages

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
<p>Algumas dicas aqui:</p>
<ol>
<li>Usamos o conteúdo de <code translate="no">README.md</code> como a descrição longa do pacote.</li>
<li>Adicione todas as dependências a <code translate="no">install_requires</code>.</li>
<li>Especifique o <code translate="no">entry_points</code>. Neste caso, definimos <code translate="no">milvus_cli</code> como um filho de <code translate="no">console_scripts</code>, para que possamos digitar <code translate="no">milvus_cli</code> como um comando diretamente após instalarmos este pacote. E o ponto de entrada de <code translate="no">milvus_cli</code> é a função <code translate="no">runCliPrompt</code> em <code translate="no">milvus_cli/scripts/milvus_cli.py</code>.</li>
</ol>
<h4 id="Build" class="common-anchor-header">Construir</h4><ol>
<li><p>Actualize o pacote <code translate="no">build</code>: <code translate="no">python3 -m pip install --upgrade build</code></p></li>
<li><p>Execute build: <code translate="no">python -m build --sdist --wheel --outdir dist/ .</code></p></li>
<li><p>Serão gerados dois ficheiros no diretório <code translate="no">dist/</code>:</p></li>
</ol>
<pre><code translate="no" class="language-shell">dist/
  example_package_YOUR_USERNAME_HERE-<span class="hljs-number">0.0</span><span class="hljs-number">.1</span>-py3-none-<span class="hljs-built_in">any</span>.whl
  example_package_YOUR_USERNAME_HERE-<span class="hljs-number">0.0</span><span class="hljs-number">.1</span>.tar.gz
<button class="copy-code-btn"></button></code></pre>
<h3 id="Publish-release" class="common-anchor-header">Publicar versão</h3><p>Consulte: https://packaging.python.org/tutorials/packaging-projects/#uploading-the-distribution-archives</p>
<ol>
<li>Atualizar o pacote <code translate="no">twine</code>: <code translate="no">python3 -m pip install --upgrade twine</code></li>
<li>Upload para <code translate="no">PYPI</code> test env: <code translate="no">python3 -m twine upload --repository testpypi dist/*</code></li>
<li>Fazer upload para <code translate="no">PYPI</code>: <code translate="no">python3 -m twine upload dist/*</code></li>
</ol>
<h3 id="CICD-by-Github-workflows" class="common-anchor-header">CI/CD por fluxos de trabalho do Github</h3><p>Consultar: https://packaging.python.org/guides/publishing-package-distribution-releases-using-github-actions-ci-cd-workflows/</p>
<p>Queremos uma maneira de fazer upload de ativos automaticamente, ele pode construir os pacotes e enviá-los para lançamentos do github e PYPI.</p>
<p>(Por alguma razão, queremos apenas que o fluxo de trabalho publique o lançamento para testar o PYPI).</p>
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
<h2 id="Learn-more-about-Milvus" class="common-anchor-header">Saiba mais sobre o Milvus<button data-href="#Learn-more-about-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus é uma ferramenta poderosa capaz de alimentar uma vasta gama de aplicações de inteligência artificial e pesquisa de similaridade vetorial. Para saber mais sobre o projeto, consulte os seguintes recursos:</p>
<ul>
<li>Leia o nosso <a href="https://milvus.io/blog">blogue</a>.</li>
<li>Interagir com a nossa comunidade de código aberto no <a href="https://milvusio.slack.com/join/shared_invite/zt-e0u4qu3k-bI2GDNys3ZqX1YCJ9OM~GQ#/shared-invite/email">Slack</a>.</li>
<li>Utilize ou contribua para a base de dados de vectores mais popular do mundo no <a href="https://github.com/milvus-io/milvus/">GitHub</a>.</li>
<li>Teste e implemente rapidamente aplicações de IA com o nosso novo <a href="https://github.com/milvus-io/bootcamp">bootcamp</a>.</li>
</ul>
