---
id: Implement-Milvus-CLI-by-Python-Click.md
title: Gambaran Umum
author: Zhen Chen
date: 2021-09-15T00:00:00.000Z
desc: Memperkenalkan cara mengimplementasikan CLI berdasarkan Python Click.
tag: Engineering
isPublish: true
---
<custom-h1>Mengimplementasikan Milvus CLI dengan Python Click</custom-h1><ul>
<li><a href="#Implement-Milvus-CLI-by-Python-Click">Mengimplementasikan Milvus CLI dengan Python Click</a><ul>
<li><a href="#Overview">Ikhtisar</a></li>
<li><a href="#Group-commands">Perintah grup</a></li>
<li><a href="#Custom-a-command">Menyesuaikan perintah</a></li>
<li><a href="#Implement-prompt-cli-for-user-to-input">Menerapkan CLI prompt untuk input pengguna</a></li>
<li><a href="#Manually-implement-autocomplete">Menerapkan pelengkapan otomatis secara manual</a></li>
<li><a href="#Add-one-time-option">Menambahkan opsi satu kali</a></li>
<li><a href="#Build-and-release">Bangun dan rilis</a></li>
<li><a href="#Learn-more-about-Milvus">Pelajari lebih lanjut tentang Milvus</a></li>
</ul></li>
</ul>
<h2 id="Overview" class="common-anchor-header">Gambaran Umum<button data-href="#Overview" class="anchor-icon" translate="no">
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
    </button></h2><p>URL proyek: https://github.com/milvus-io/milvus_cli</p>
<p>Persiapan <code translate="no">Python3.8</code>,<a href="https://click.palletsprojects.com/en/8.0.x/api/"> <code translate="no">Click 8.0.x</code></a></p>
<h2 id="Group-commands" class="common-anchor-header">Perintah grup<button data-href="#Group-commands" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Create-a-command" class="common-anchor-header">Membuat sebuah perintah</h3><pre><code translate="no" class="language-python"><span class="hljs-keyword">import</span> click
<span class="hljs-keyword">from</span> utils <span class="hljs-keyword">import</span> PyOrm

<span class="hljs-meta">@click.group(<span class="hljs-params">no_args_is_help=<span class="hljs-literal">False</span>, add_help_option=<span class="hljs-literal">False</span>, invoke_without_command=<span class="hljs-literal">True</span></span>)</span>
<span class="hljs-meta">@click.pass_context</span>
<span class="hljs-keyword">def</span> <span class="hljs-title function_">cli</span>(<span class="hljs-params">ctx</span>):
    <span class="hljs-string">&quot;&quot;&quot;Milvus CLI&quot;&quot;&quot;</span>
    ctx.obj = PyOrm() <span class="hljs-comment"># PyOrm is a util class which wraps the milvus python SDK. You can pass any class instance here. Any command function passed by @click.obj can call it.</span>

<span class="hljs-keyword">if</span> __name__ == <span class="hljs-string">&#x27;__main__&#x27;</span>:
    cli()
<button class="copy-code-btn"></button></code></pre>
<p>Seperti kode di atas, kita menggunakan <code translate="no">@click.group()</code> untuk membuat grup perintah <code translate="no">cli</code> sebagai titik masuk. Untuk mengimplementasikan CLI yang cepat, kita perlu menonaktifkan pesan bantuan untuk entri tersebut, jadi kita tambahkan <code translate="no">no_args_is_help=False</code>, <code translate="no">add_help_option=False</code> dan <code translate="no">invoke_without_command=True</code>. Dan tidak ada yang akan dicetak jika kita memasukkan <code translate="no">cli</code> di terminal saja.</p>
<p>Selain itu kita menggunakan <code translate="no">@click.pass_context</code> untuk memberikan konteks ke grup ini untuk penggunaan lebih lanjut.</p>
<h3 id="Create-a-sub-command-of-command-group" class="common-anchor-header">Membuat sub perintah dari grup perintah</h3><p>Kemudian kita tambahkan sub perintah pertama <code translate="no">help</code> di bawah <code translate="no">cli</code>:</p>
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
<p>Sekarang kita dapat menggunakan <code translate="no">cli help</code> di terminal:</p>
<pre><code translate="no" class="language-shell">$ python milvus_cli/scripts/milvus_cli.py <span class="hljs-built_in">help</span>
<button class="copy-code-btn"></button></code></pre>
<h3 id="Create-a-sub-group-of-a-command-group" class="common-anchor-header">Membuat sub grup dari grup perintah</h3><p>Kita tidak hanya ingin memiliki sub perintah seperti <code translate="no">cli help</code>, tetapi kita juga membutuhkan sub grup perintah seperti <code translate="no">cli list collection</code>, <code translate="no">cli list partition</code> dan <code translate="no">cli list indexes</code>.</p>
<p>Pertama kita buat sub grup perintah <code translate="no">list</code>, disini kita bisa memberikan parameter pertama ke <code translate="no">@cli.group</code> sebagai nama perintah dan bukan menggunakan nama fungsi default, sehingga kita bisa mengurangi duplikasi nama fungsi.</p>
<p>Perhatian di sini, kita menggunakan <code translate="no">@cli.group()</code> dan bukan <code translate="no">@click.group</code> sehingga kita membuat sub grup dari grup asal.</p>
<p>Kita menggunakan <code translate="no">@click.pass_obj</code> untuk meneruskan <code translate="no">context.obj</code> ke sub perintah dari sub grup ini.</p>
<pre><code translate="no" class="language-python"><span class="hljs-meta">@cli.group(<span class="hljs-params"><span class="hljs-string">&#x27;list&#x27;</span>, no_args_is_help=<span class="hljs-literal">False</span></span>)</span>
<span class="hljs-meta">@click.pass_obj</span>
<span class="hljs-keyword">def</span> <span class="hljs-title function_">listDetails</span>(<span class="hljs-params">obj</span>):
    <span class="hljs-string">&quot;&quot;&quot;List collections, partitions and indexes.&quot;&quot;&quot;</span>
    <span class="hljs-keyword">pass</span>
<button class="copy-code-btn"></button></code></pre>
<p>Kemudian kita menambahkan beberapa sub perintah ke dalam sub grup ini dengan <code translate="no">@listDetails.command()</code> (bukan <code translate="no">@cli.command()</code>). Ini hanya sebuah contoh, Anda dapat mengabaikan implementasinya dan kita akan membahasnya nanti.</p>
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
<p>Setelah semua ini selesai, kita memiliki perintah miltigroup yang terlihat seperti:</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://user-images.githubusercontent.com/83751452/132306467-71d81e50-3d6c-4fbe-81fc-db7280cb4838.png" alt="image" class="doc-image" id="image" />
   </span> <span class="img-wrapper"> <span>image</span> </span></p>
<h2 id="Custom-a-command" class="common-anchor-header">Menyesuaikan sebuah perintah<button data-href="#Custom-a-command" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Add-options" class="common-anchor-header">Menambahkan opsi</h3><p>Anda dapat menambahkan beberapa opsi pada perintah yang akan digunakan seperti <code translate="no">cli --test-option value</code>.</p>
<p>Berikut ini adalah contohnya, kita menambahkan tiga opsi <code translate="no">alias</code>, <code translate="no">host</code> dan <code translate="no">port</code> untuk menentukan alamat yang akan terhubung ke Milvus.</p>
<p>Dua parameter pertama mendefinisikan nama opsi singkat dan lengkap, parameter ketiga mendefinisikan nama variabel, parameter <code translate="no">help</code> menentukan pesan bantuan singkat, parameter <code translate="no">default</code> menentukan nilai default dan <code translate="no">type</code> menentukan tipe nilai.</p>
<p>Dan semua nilai opsi akan diteruskan ke dalam fungsi sesuai dengan urutan definisi.</p>
<pre><code translate="no" class="language-python"><span class="hljs-meta">@cli.command(<span class="hljs-params">no_args_is_help=<span class="hljs-literal">False</span></span>)</span>
<span class="hljs-meta">@click.option(<span class="hljs-params"><span class="hljs-string">&#x27;-a&#x27;</span>, <span class="hljs-string">&#x27;--alias&#x27;</span>, <span class="hljs-string">&#x27;alias&#x27;</span>, <span class="hljs-built_in">help</span>=<span class="hljs-string">&quot;Milvus link alias name, default is `default`.&quot;</span>, default=<span class="hljs-string">&#x27;default&#x27;</span>, <span class="hljs-built_in">type</span>=<span class="hljs-built_in">str</span></span>)</span>
<span class="hljs-meta">@click.option(<span class="hljs-params"><span class="hljs-string">&#x27;-h&#x27;</span>, <span class="hljs-string">&#x27;--host&#x27;</span>, <span class="hljs-string">&#x27;host&#x27;</span>, <span class="hljs-built_in">help</span>=<span class="hljs-string">&quot;Host name, default is `127.0.0.1`.&quot;</span>, default=<span class="hljs-string">&#x27;127.0.0.1&#x27;</span>, <span class="hljs-built_in">type</span>=<span class="hljs-built_in">str</span></span>)</span>
<span class="hljs-meta">@click.option(<span class="hljs-params"><span class="hljs-string">&#x27;-p&#x27;</span>, <span class="hljs-string">&#x27;--port&#x27;</span>, <span class="hljs-string">&#x27;port&#x27;</span>, <span class="hljs-built_in">help</span>=<span class="hljs-string">&quot;Port, default is `19530`.&quot;</span>, default=<span class="hljs-number">19530</span>, <span class="hljs-built_in">type</span>=<span class="hljs-built_in">int</span></span>)</span>
<span class="hljs-meta">@click.pass_obj</span>
<span class="hljs-keyword">def</span> <span class="hljs-title function_">connect</span>(<span class="hljs-params">obj, alias, host, port</span>):
    <span class="hljs-keyword">pass</span>
<button class="copy-code-btn"></button></code></pre>
<h3 id="Add-flag-options" class="common-anchor-header">Menambahkan opsi bendera</h3><p>Kita menggunakan opsi di atas untuk mengoper nilai, tetapi terkadang kita hanya membutuhkan flag sebagai nilai boolean.</p>
<p>Seperti contoh di bawah ini, opsi <code translate="no">autoId</code> adalah opsi flag dan tidak mengoper data apa pun ke fungsi, jadi kita dapat menggunakannya seperti <code translate="no">cli create collection -c c_name -p p_name -a</code>.</p>
<pre><code translate="no" class="language-python"><span class="hljs-meta">@createDetails.command(<span class="hljs-params"><span class="hljs-string">&#x27;collection&#x27;</span></span>)</span>
<span class="hljs-meta">@click.option(<span class="hljs-params"><span class="hljs-string">&#x27;-c&#x27;</span>, <span class="hljs-string">&#x27;--collection-name&#x27;</span>, <span class="hljs-string">&#x27;collectionName&#x27;</span>, <span class="hljs-built_in">help</span>=<span class="hljs-string">&#x27;Collection name to be created.&#x27;</span>, default=<span class="hljs-string">&#x27;&#x27;</span></span>)</span>
<span class="hljs-meta">@click.option(<span class="hljs-params"><span class="hljs-string">&#x27;-p&#x27;</span>, <span class="hljs-string">&#x27;--schema-primary-field&#x27;</span>, <span class="hljs-string">&#x27;primaryField&#x27;</span>, <span class="hljs-built_in">help</span>=<span class="hljs-string">&#x27;Primary field name.&#x27;</span>, default=<span class="hljs-string">&#x27;&#x27;</span></span>)</span>
<span class="hljs-meta">@click.option(<span class="hljs-params"><span class="hljs-string">&#x27;-a&#x27;</span>, <span class="hljs-string">&#x27;--schema-auto-id&#x27;</span>, <span class="hljs-string">&#x27;autoId&#x27;</span>, <span class="hljs-built_in">help</span>=<span class="hljs-string">&#x27;Enable auto id.&#x27;</span>, default=<span class="hljs-literal">False</span>, is_flag=<span class="hljs-literal">True</span></span>)</span>
<span class="hljs-meta">@click.pass_obj</span>
<span class="hljs-keyword">def</span> <span class="hljs-title function_">createCollection</span>(<span class="hljs-params">obj, collectionName, primaryField, autoId, description, fields</span>):
    <span class="hljs-keyword">pass</span>
<button class="copy-code-btn"></button></code></pre>
<h3 id="Add-arguments" class="common-anchor-header">Menambahkan argumen</h3><p>Dalam proyek ini kita mengganti semua penggunaan argumen dengan penggunaan opsi. Namun kita masih memperkenalkan penggunaan argumen di sini. Berbeda dengan options, argumen digunakan seperti <code translate="no">cli COMMAND [OPTIONS] ARGUEMENTS</code>. Jika kita ubah contoh di atas menjadi penggunaan argumen, maka akan menjadi seperti ini:</p>
<pre><code translate="no" class="language-python"><span class="hljs-meta">@createDetails.command(<span class="hljs-params"><span class="hljs-string">&#x27;collection&#x27;</span></span>)</span>
<span class="hljs-meta">@click.argument(<span class="hljs-params"><span class="hljs-string">&#x27;collectionName&#x27;</span></span>)</span>
<span class="hljs-meta">@click.option(<span class="hljs-params"><span class="hljs-string">&#x27;-p&#x27;</span>, <span class="hljs-string">&#x27;--schema-primary-field&#x27;</span>, <span class="hljs-string">&#x27;primaryField&#x27;</span>, <span class="hljs-built_in">help</span>=<span class="hljs-string">&#x27;Primary field name.&#x27;</span>, default=<span class="hljs-string">&#x27;&#x27;</span></span>)</span>
<span class="hljs-meta">@click.option(<span class="hljs-params"><span class="hljs-string">&#x27;-a&#x27;</span>, <span class="hljs-string">&#x27;--schema-auto-id&#x27;</span>, <span class="hljs-string">&#x27;autoId&#x27;</span>, <span class="hljs-built_in">help</span>=<span class="hljs-string">&#x27;Enable auto id.&#x27;</span>, default=<span class="hljs-literal">False</span>, is_flag=<span class="hljs-literal">True</span></span>)</span>
<span class="hljs-meta">@click.pass_obj</span>
<span class="hljs-keyword">def</span> <span class="hljs-title function_">createCollection</span>(<span class="hljs-params">obj, collectionName, primaryField, autoId, description, fields</span>):
    <span class="hljs-keyword">pass</span>
<button class="copy-code-btn"></button></code></pre>
<p>Maka penggunaannya akan menjadi <code translate="no">cli create collection c_name -p p_name -a</code>.</p>
<h3 id="Add-full-help-message" class="common-anchor-header">Menambahkan pesan bantuan lengkap</h3><p>Setelah kita mendefinisikan pesan bantuan singkat di atas, kita dapat mendefinisikan pesan bantuan lengkap di dalam fungsi:</p>
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
<p>Blok pertama di dalam fungsi tersebut adalah pesan bantuan yang akan dicetak setelah kita memasukkan <code translate="no">cli connect --help</code>.</p>
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
<h3 id="Add-confirm" class="common-anchor-header">Tambahkan konfirmasi</h3><p>Terkadang kita membutuhkan pengguna untuk mengkonfirmasi beberapa tindakan, terutama menghapus sesuatu. Kita dapat menambahkan <code translate="no">click.confirm</code> untuk menjeda dan meminta pengguna untuk mengkonfirmasi:</p>
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
<p>Seperti contoh di atas, percakapan konfirmasi akan muncul seperti <code translate="no">Aborted!ant to continue? [y/N]:</code>.</p>
<h3 id="Add-prompts" class="common-anchor-header">Tambahkan petunjuk</h3><p>Untuk mengimplementasikan prompt, kita perlu menambahkan <code translate="no">click.prompt</code>.</p>
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
<p>Prompt akan muncul ketika setiap <code translate="no">click.prompt</code>. Kami menggunakan beberapa prompt secara berurutan sehingga akan terlihat seperti percakapan yang berkelanjutan. Hal ini memastikan pengguna akan memasukkan data sesuai dengan urutan yang kita inginkan. Dalam hal ini kita membutuhkan pengguna untuk memilih sebuah koleksi terlebih dahulu, dan kita perlu mendapatkan semua partisi di bawah koleksi tersebut, lalu menampilkannya kepada pengguna untuk dipilih.</p>
<h3 id="Add-choices" class="common-anchor-header">Menambahkan pilihan</h3><p>Terkadang Anda ingin pengguna hanya memasukkan rentang/jenis nilai yang terbatas, Anda dapat menambahkan <code translate="no">type=click.Choice([&lt;any&gt;])</code> ke <code translate="no">click.prompt</code>, <code translate="no">click.options</code> dan lain-lain.</p>
<p>Misalnya,</p>
<pre><code translate="no" class="language-python">collectionName = click.prompt(
        <span class="hljs-string">&#x27;Collection name&#x27;</span>, <span class="hljs-built_in">type</span>=click.Choice([<span class="hljs-string">&#x27;collection_1&#x27;</span>, <span class="hljs-string">&#x27;collection_2&#x27;</span>]))
<button class="copy-code-btn"></button></code></pre>
<p>Maka pengguna hanya dapat memasukkan <code translate="no">collection_1</code> atau <code translate="no">collection_2</code>, kesalahan akan muncul jika ada input lain.</p>
<h3 id="Add-clear-screen" class="common-anchor-header">Tambahkan layar yang jelas</h3><p>Anda dapat menggunakan <code translate="no">click.clear()</code> untuk mengimplementasikannya.</p>
<pre><code translate="no" class="language-python"><span class="hljs-meta">@cli.command()</span>
<span class="hljs-keyword">def</span> <span class="hljs-title function_">clear</span>():
    <span class="hljs-string">&quot;&quot;&quot;Clear screen.&quot;&quot;&quot;</span>
    click.clear()
<button class="copy-code-btn"></button></code></pre>
<h3 id="Additional-tips" class="common-anchor-header">Tips tambahan</h3><ul>
<li>Nilai defaultnya adalah <code translate="no">None</code>, jadi tidak ada artinya jika Anda menentukan nilai default sebagai <code translate="no">None</code>. Dan default <code translate="no">None</code> akan menyebabkan <code translate="no">click.prompt</code> terus ditampilkan jika Anda ingin mengosongkan nilai untuk melompati nilai tersebut.</li>
</ul>
<h2 id="Implement-prompt-CLI-for-user-to-input" class="common-anchor-header">Menerapkan prompt CLI untuk pengguna untuk memasukkan input<button data-href="#Implement-prompt-CLI-for-user-to-input" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Why-prompt-CLI" class="common-anchor-header">Mengapa prompt CLI</h3><p>Untuk operasi basis data, kita membutuhkan koneksi secara terus menerus ke sebuah instance. Jika kita menggunakan mode baris perintah asal, koneksi akan terputus setelah setiap perintah dilakukan. Kita juga ingin menyimpan beberapa data ketika menggunakan CLI, dan membersihkannya setelah keluar.</p>
<h3 id="Implement" class="common-anchor-header">Menerapkan</h3><ol>
<li>Gunakan <code translate="no">while True</code> untuk mendengarkan input pengguna secara terus menerus.</li>
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
<li>Penggunaan <code translate="no">input</code> saja akan menyebabkan <code translate="no">up</code>, <code translate="no">down</code>, <code translate="no">left</code>, <code translate="no">right</code> tombol panah, tombol <code translate="no">tab</code> dan beberapa tombol lainnya dikonversi ke string Acsii secara otomatis. Selain itu perintah history tidak dapat dibaca dari session. Jadi kita tambahkan <code translate="no">readline</code> ke dalam fungsi <code translate="no">runCliPrompt</code>.</li>
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
<li>Tambahkan <code translate="no">quit</code> CLI.</li>
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
<li>Tangkap kesalahan <code translate="no">KeyboardInterrupt</code> saat menggunakan <code translate="no">ctrl C</code> untuk keluar.</li>
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
<li>Setelah semua beres, tampilan CLI sekarang menjadi seperti ini:</li>
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
<h2 id="Manually-implement-autocomplete" class="common-anchor-header">Menerapkan pelengkapan otomatis secara manual<button data-href="#Manually-implement-autocomplete" class="anchor-icon" translate="no">
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
    </button></h2><p>Berbeda dengan pelengkapan otomatis shell klik, proyek kita membungkus baris perintah dan menggunakan perulangan untuk mendapatkan masukan dari pengguna untuk mengimplementasikan baris perintah prompt. Jadi kita perlu mengikat pelengkap ke <code translate="no">readline</code>.</p>
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
<p>Setelah mendefinisikan <code translate="no">Completer</code> kita bisa mengikatnya dengan readline:</p>
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
<h2 id="Add-one-time-option" class="common-anchor-header">Menambahkan opsi satu kali<button data-href="#Add-one-time-option" class="anchor-icon" translate="no">
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
    </button></h2><p>Untuk baris perintah prompt, terkadang kita tidak ingin sepenuhnya menjalankan script untuk mendapatkan beberapa informasi seperti versi. Contoh yang baik adalah <code translate="no">Python</code>, ketika Anda mengetik <code translate="no">python</code> di terminal, baris perintah promtp akan muncul, tetapi hanya mengembalikan pesan versi dan tidak akan masuk ke dalam skrip prompt jika Anda mengetik <code translate="no">python -V</code>. Jadi kita dapat menggunakan <code translate="no">sys.args</code> dalam kode kita untuk mengimplementasikannya.</p>
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
<p>Kita mendapatkan <code translate="no">sys.args</code> sebelum perulangan ketika pertama kali menjalankan skrip CLI. Jika argumen terakhir adalah <code translate="no">--version</code>, kode akan mengembalikan versi paket tanpa mengalami perulangan.</p>
<p>Ini akan sangat membantu setelah kita membuat kode sebagai sebuah paket. Pengguna dapat mengetikkan <code translate="no">milvus_cli</code> untuk langsung masuk ke CLI, atau mengetikkan <code translate="no">milvus_cli --version</code> untuk mendapatkan versinya saja.</p>
<h2 id="Build-and-release" class="common-anchor-header">Membangun dan merilis<button data-href="#Build-and-release" class="anchor-icon" translate="no">
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
    </button></h2><p>Terakhir, kita ingin membangun sebuah paket dan merilisnya dengan PYPI. Sehingga pengguna cukup menggunakan <code translate="no">pip install &lt;package name&gt;</code> untuk menginstal.</p>
<h3 id="Install-locally-for-test" class="common-anchor-header">Menginstal secara lokal untuk pengujian</h3><p>Sebelum Anda mempublikasikan paket ke PYPI, Anda mungkin ingin menginstalnya secara lokal untuk beberapa pengujian.</p>
<p>Dalam hal ini, Anda cukup memasukkan <code translate="no">cd</code> ke dalam direktori paket dan menjalankan <code translate="no">pip install -e .</code> (Jangan lupa <code translate="no">.</code>).</p>
<h3 id="Create-package-files" class="common-anchor-header">Membuat berkas-berkas paket</h3><p>Lihat: https://packaging.python.org/tutorials/packaging-projects/</p>
<p>Struktur sebuah paket akan terlihat seperti ini:</p>
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
<h4 id="Create-the-package-directory" class="common-anchor-header">Membuat direktori paket</h4><p>Buat direktori <code translate="no">Milvus_cli</code> dengan struktur di bawah ini:</p>
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
<h4 id="Write-the-entry-code" class="common-anchor-header">Tulis kode entri</h4><p>Entri skrip harus berada di <code translate="no">Milvus_cli/milvus_cli/scripts</code>, dan <code translate="no">Milvus_cli/milvus_cli/scripts/milvus_cli.py</code> harus seperti:</p>
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
<h4 id="Edit-the-setuppy" class="common-anchor-header">Edit <code translate="no">setup.py</code></h4><pre><code translate="no" class="language-python"><span class="hljs-keyword">from</span> setuptools <span class="hljs-keyword">import</span> setup, find_packages

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
<p>Beberapa tips di sini:</p>
<ol>
<li>Kami menggunakan konten <code translate="no">README.md</code> sebagai deskripsi panjang paket.</li>
<li>Tambahkan semua dependensi ke <code translate="no">install_requires</code>.</li>
<li>Tentukan <code translate="no">entry_points</code>. Dalam kasus ini, kita menetapkan <code translate="no">milvus_cli</code> sebagai anak dari <code translate="no">console_scripts</code>, sehingga kita dapat mengetikkan <code translate="no">milvus_cli</code> sebagai perintah secara langsung setelah kita menginstal paket ini. Dan titik masuk <code translate="no">milvus_cli</code> adalah fungsi <code translate="no">runCliPrompt</code> di <code translate="no">milvus_cli/scripts/milvus_cli.py</code>.</li>
</ol>
<h4 id="Build" class="common-anchor-header">Membangun</h4><ol>
<li><p>Tingkatkan paket <code translate="no">build</code>: <code translate="no">python3 -m pip install --upgrade build</code></p></li>
<li><p>Jalankan build: <code translate="no">python -m build --sdist --wheel --outdir dist/ .</code></p></li>
<li><p>Dua berkas akan dihasilkan di bawah direktori <code translate="no">dist/</code>:</p></li>
</ol>
<pre><code translate="no" class="language-shell">dist/
  example_package_YOUR_USERNAME_HERE-<span class="hljs-number">0.0</span><span class="hljs-number">.1</span>-py3-none-<span class="hljs-built_in">any</span>.whl
  example_package_YOUR_USERNAME_HERE-<span class="hljs-number">0.0</span><span class="hljs-number">.1</span>.tar.gz
<button class="copy-code-btn"></button></code></pre>
<h3 id="Publish-release" class="common-anchor-header">Publikasikan rilis</h3><p>Lihat: https://packaging.python.org/tutorials/packaging-projects/#uploading-the-distribution-archives</p>
<ol>
<li>Tingkatkan paket <code translate="no">twine</code>: <code translate="no">python3 -m pip install --upgrade twine</code></li>
<li>Unggah ke <code translate="no">PYPI</code> test env: <code translate="no">python3 -m twine upload --repository testpypi dist/*</code></li>
<li>Unggah ke <code translate="no">PYPI</code>: <code translate="no">python3 -m twine upload dist/*</code></li>
</ol>
<h3 id="CICD-by-Github-workflows" class="common-anchor-header">Alur kerja CI/CD oleh Github</h3><p>Lihat: https://packaging.python.org/guides/publishing-package-distribution-releases-using-github-actions-ci-cd-workflows/</p>
<p>Kami ingin ada cara untuk mengunggah aset secara otomatis, yang dapat membangun paket dan mengunggahnya ke rilis github dan PYPI.</p>
<p>(Untuk beberapa alasan, kami hanya ingin alur kerja hanya mempublikasikan rilis untuk menguji PYPI).</p>
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
<h2 id="Learn-more-about-Milvus" class="common-anchor-header">Pelajari lebih lanjut tentang Milvus<button data-href="#Learn-more-about-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus adalah alat yang kuat yang mampu memberdayakan beragam kecerdasan buatan dan aplikasi pencarian kemiripan vektor. Untuk mempelajari lebih lanjut tentang proyek ini, lihat sumber-sumber berikut:</p>
<ul>
<li>Baca <a href="https://milvus.io/blog">blog</a> kami.</li>
<li>Berinteraksi dengan komunitas sumber terbuka kami di <a href="https://milvusio.slack.com/join/shared_invite/zt-e0u4qu3k-bI2GDNys3ZqX1YCJ9OM~GQ#/shared-invite/email">Slack</a>.</li>
<li>Gunakan atau kontribusikan database vektor paling populer di dunia di <a href="https://github.com/milvus-io/milvus/">GitHub</a>.</li>
<li>Menguji dan menerapkan aplikasi AI dengan cepat menggunakan <a href="https://github.com/milvus-io/bootcamp">bootcamp</a> baru kami.</li>
</ul>
