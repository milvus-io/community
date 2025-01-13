---
id: Implement-Milvus-CLI-by-Python-Click.md
title: نظرة عامة
author: Zhen Chen
date: 2021-09-15T00:00:00.000Z
desc: تقديم كيفية تنفيذ واجهة CLI استنادًا إلى Python Click.
tag: Engineering
isPublish: true
---
<custom-h1>تنفيذ Milvus CLI بواسطة Python Click</custom-h1><ul>
<li><a href="#Implement-Milvus-CLI-by-Python-Click">تنفيذ Milvus CLI بواسطة Python Click</a><ul>
<li><a href="#Overview">نظرة عامة</a></li>
<li><a href="#Group-commands">تجميع الأوامر</a></li>
<li><a href="#Custom-a-command">تخصيص أمر</a></li>
<li><a href="#Implement-prompt-cli-for-user-to-input">تنفيذ أمر CLI الفوري للمستخدم لإدخاله</a></li>
<li><a href="#Manually-implement-autocomplete">تنفيذ الإكمال التلقائي يدوياً</a></li>
<li><a href="#Add-one-time-option">إضافة خيار لمرة واحدة</a></li>
<li><a href="#Build-and-release">الإنشاء والإصدار</a></li>
<li><a href="#Learn-more-about-Milvus">معرفة المزيد عن ميلفوس</a></li>
</ul></li>
</ul>
<h2 id="Overview" class="common-anchor-header">نظرة عامة<button data-href="#Overview" class="anchor-icon" translate="no">
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
    </button></h2><p>عنوان URL للمشروع: https://github.com/milvus-io/milvus_cli</p>
<p>التحضير <code translate="no">Python3.8</code>,<a href="https://click.palletsprojects.com/en/8.0.x/api/"> <code translate="no">Click 8.0.x</code></a></p>
<h2 id="Group-commands" class="common-anchor-header">تجميع الأوامر<button data-href="#Group-commands" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Create-a-command" class="common-anchor-header">إنشاء أمر</h3><pre><code translate="no" class="language-python"><span class="hljs-keyword">import</span> click
<span class="hljs-keyword">from</span> utils <span class="hljs-keyword">import</span> PyOrm

<span class="hljs-meta">@click.group(<span class="hljs-params">no_args_is_help=<span class="hljs-literal">False</span>, add_help_option=<span class="hljs-literal">False</span>, invoke_without_command=<span class="hljs-literal">True</span></span>)</span>
<span class="hljs-meta">@click.pass_context</span>
<span class="hljs-keyword">def</span> <span class="hljs-title function_">cli</span>(<span class="hljs-params">ctx</span>):
    <span class="hljs-string">&quot;&quot;&quot;Milvus CLI&quot;&quot;&quot;</span>
    ctx.obj = PyOrm() <span class="hljs-comment"># PyOrm is a util class which wraps the milvus python SDK. You can pass any class instance here. Any command function passed by @click.obj can call it.</span>

<span class="hljs-keyword">if</span> __name__ == <span class="hljs-string">&#x27;__main__&#x27;</span>:
    cli()
<button class="copy-code-btn"></button></code></pre>
<p>كما في الكود أعلاه، نستخدم <code translate="no">@click.group()</code> لإنشاء مجموعة أوامر <code translate="no">cli</code> كنقطة دخول. لتنفيذ CLI موجه نحتاج إلى تعطيل رسائل المساعدة للإدخال، لذلك نضيف <code translate="no">no_args_is_help=False</code> و <code translate="no">add_help_option=False</code> و <code translate="no">invoke_without_command=True</code>. ولن تتم طباعة أي شيء إذا قمنا بإدخال <code translate="no">cli</code> في المحطة الطرفية فقط.</p>
<p>إلى جانب ذلك نستخدم <code translate="no">@click.pass_context</code> لتمرير سياق إلى هذه المجموعة لمزيد من الاستخدام.</p>
<h3 id="Create-a-sub-command-of-command-group" class="common-anchor-header">إنشاء أمر فرعي لمجموعة الأوامر</h3><p>ثم نضيف الأمر الفرعي الأول <code translate="no">help</code> تحت <code translate="no">cli</code>:</p>
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
<p>الآن يمكننا استخدام <code translate="no">cli help</code> في المحطة الطرفية:</p>
<pre><code translate="no" class="language-shell">$ python milvus_cli/scripts/milvus_cli.py <span class="hljs-built_in">help</span>
<button class="copy-code-btn"></button></code></pre>
<h3 id="Create-a-sub-group-of-a-command-group" class="common-anchor-header">إنشاء مجموعة فرعية لمجموعة أوامر</h3><p>لا نريد فقط أن يكون لدينا أمر فرعي مثل <code translate="no">cli help</code> ، ولكننا نحتاج أيضًا إلى أوامر مجموعة فرعية مثل <code translate="no">cli list collection</code> و <code translate="no">cli list partition</code> و <code translate="no">cli list indexes</code>.</p>
<p>أولاً ننشئ أمر مجموعة فرعية <code translate="no">list</code> ، هنا يمكننا تمرير المعلمة الأولى إلى <code translate="no">@cli.group</code> كاسم الأمر بدلاً من استخدام اسم الدالة المحدد، حتى نتمكن من تقليل أسماء الدوال المكررة.</p>
<p>انتبه هنا، نستخدم <code translate="no">@cli.group()</code> بدلاً من <code translate="no">@click.group</code> حتى نتمكن من إنشاء مجموعة فرعية من المجموعة الأصلية.</p>
<p>نستخدم <code translate="no">@click.pass_obj</code> لتمرير <code translate="no">context.obj</code> إلى الأوامر الفرعية لهذه المجموعة الفرعية.</p>
<pre><code translate="no" class="language-python"><span class="hljs-meta">@cli.group(<span class="hljs-params"><span class="hljs-string">&#x27;list&#x27;</span>, no_args_is_help=<span class="hljs-literal">False</span></span>)</span>
<span class="hljs-meta">@click.pass_obj</span>
<span class="hljs-keyword">def</span> <span class="hljs-title function_">listDetails</span>(<span class="hljs-params">obj</span>):
    <span class="hljs-string">&quot;&quot;&quot;List collections, partitions and indexes.&quot;&quot;&quot;</span>
    <span class="hljs-keyword">pass</span>
<button class="copy-code-btn"></button></code></pre>
<p>ثم نضيف بعض الأوامر الفرعية إلى هذه المجموعة الفرعية عن طريق <code translate="no">@listDetails.command()</code> (وليس <code translate="no">@cli.command()</code>). هذا مجرد مثال، يمكنك تجاهل التنفيذ وسنناقشه لاحقًا.</p>
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
<p>بعد اكتمال كل هذه الأوامر، يكون لدينا أوامر مجموعة ميلتيغروب التي تبدو مثل:</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://user-images.githubusercontent.com/83751452/132306467-71d81e50-3d6c-4fbe-81fc-db7280cb4838.png" alt="image" class="doc-image" id="image" />
   </span> <span class="img-wrapper"> <span>صورة</span> </span></p>
<h2 id="Custom-a-command" class="common-anchor-header">تخصيص أمر<button data-href="#Custom-a-command" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Add-options" class="common-anchor-header">إضافة خيارات</h3><p>يمكنك إضافة بعض الخيارات إلى الأمر الذي سيتم استخدامه مثل <code translate="no">cli --test-option value</code>.</p>
<p>إليك مثال، نضيف ثلاثة خيارات <code translate="no">alias</code> و <code translate="no">host</code> و <code translate="no">port</code> لتحديد عنوان للاتصال بـ ميلتجروب.</p>
<p>تحدد المعاملتان الأوليان اسم الخيار القصير والكامل، وتحدد المعلمة الثالثة اسم المتغير، وتحدد المعلمة <code translate="no">help</code> رسالة المساعدة القصيرة، وتحدد المعلمة <code translate="no">default</code> القيمة الافتراضية وتحدد المعلمة <code translate="no">type</code> نوع القيمة.</p>
<p>وسيتم تمرير جميع قيم الخيارات إلى الدالة بترتيب التعريف.</p>
<pre><code translate="no" class="language-python"><span class="hljs-meta">@cli.command(<span class="hljs-params">no_args_is_help=<span class="hljs-literal">False</span></span>)</span>
<span class="hljs-meta">@click.option(<span class="hljs-params"><span class="hljs-string">&#x27;-a&#x27;</span>, <span class="hljs-string">&#x27;--alias&#x27;</span>, <span class="hljs-string">&#x27;alias&#x27;</span>, <span class="hljs-built_in">help</span>=<span class="hljs-string">&quot;Milvus link alias name, default is `default`.&quot;</span>, default=<span class="hljs-string">&#x27;default&#x27;</span>, <span class="hljs-built_in">type</span>=<span class="hljs-built_in">str</span></span>)</span>
<span class="hljs-meta">@click.option(<span class="hljs-params"><span class="hljs-string">&#x27;-h&#x27;</span>, <span class="hljs-string">&#x27;--host&#x27;</span>, <span class="hljs-string">&#x27;host&#x27;</span>, <span class="hljs-built_in">help</span>=<span class="hljs-string">&quot;Host name, default is `127.0.0.1`.&quot;</span>, default=<span class="hljs-string">&#x27;127.0.0.1&#x27;</span>, <span class="hljs-built_in">type</span>=<span class="hljs-built_in">str</span></span>)</span>
<span class="hljs-meta">@click.option(<span class="hljs-params"><span class="hljs-string">&#x27;-p&#x27;</span>, <span class="hljs-string">&#x27;--port&#x27;</span>, <span class="hljs-string">&#x27;port&#x27;</span>, <span class="hljs-built_in">help</span>=<span class="hljs-string">&quot;Port, default is `19530`.&quot;</span>, default=<span class="hljs-number">19530</span>, <span class="hljs-built_in">type</span>=<span class="hljs-built_in">int</span></span>)</span>
<span class="hljs-meta">@click.pass_obj</span>
<span class="hljs-keyword">def</span> <span class="hljs-title function_">connect</span>(<span class="hljs-params">obj, alias, host, port</span>):
    <span class="hljs-keyword">pass</span>
<button class="copy-code-btn"></button></code></pre>
<h3 id="Add-flag-options" class="common-anchor-header">إضافة خيارات العلم</h3><p>نحن نستخدم الخيارات أعلاه لتمرير قيمة، ولكن في بعض الأحيان نحتاج فقط إلى علامة كقيمة منطقية.</p>
<p>كما في المثال أدناه، الخيار <code translate="no">autoId</code> هو خيار علم ولا يمرر أي بيانات إلى الدالة، لذا يمكننا استخدامه مثل <code translate="no">cli create collection -c c_name -p p_name -a</code>.</p>
<pre><code translate="no" class="language-python"><span class="hljs-meta">@createDetails.command(<span class="hljs-params"><span class="hljs-string">&#x27;collection&#x27;</span></span>)</span>
<span class="hljs-meta">@click.option(<span class="hljs-params"><span class="hljs-string">&#x27;-c&#x27;</span>, <span class="hljs-string">&#x27;--collection-name&#x27;</span>, <span class="hljs-string">&#x27;collectionName&#x27;</span>, <span class="hljs-built_in">help</span>=<span class="hljs-string">&#x27;Collection name to be created.&#x27;</span>, default=<span class="hljs-string">&#x27;&#x27;</span></span>)</span>
<span class="hljs-meta">@click.option(<span class="hljs-params"><span class="hljs-string">&#x27;-p&#x27;</span>, <span class="hljs-string">&#x27;--schema-primary-field&#x27;</span>, <span class="hljs-string">&#x27;primaryField&#x27;</span>, <span class="hljs-built_in">help</span>=<span class="hljs-string">&#x27;Primary field name.&#x27;</span>, default=<span class="hljs-string">&#x27;&#x27;</span></span>)</span>
<span class="hljs-meta">@click.option(<span class="hljs-params"><span class="hljs-string">&#x27;-a&#x27;</span>, <span class="hljs-string">&#x27;--schema-auto-id&#x27;</span>, <span class="hljs-string">&#x27;autoId&#x27;</span>, <span class="hljs-built_in">help</span>=<span class="hljs-string">&#x27;Enable auto id.&#x27;</span>, default=<span class="hljs-literal">False</span>, is_flag=<span class="hljs-literal">True</span></span>)</span>
<span class="hljs-meta">@click.pass_obj</span>
<span class="hljs-keyword">def</span> <span class="hljs-title function_">createCollection</span>(<span class="hljs-params">obj, collectionName, primaryField, autoId, description, fields</span>):
    <span class="hljs-keyword">pass</span>
<button class="copy-code-btn"></button></code></pre>
<h3 id="Add-arguments" class="common-anchor-header">إضافة الوسيطات</h3><p>في هذا المشروع نستبدل كل استخدام الوسيطات باستخدام الخيارات. لكننا ما زلنا نقدم استخدام الوسيطات هنا. تختلف عن الخيارات، يتم استخدام الحجج مثل <code translate="no">cli COMMAND [OPTIONS] ARGUEMENTS</code>. إذا قمنا بتحويل المثال أعلاه إلى استخدام الحجج، فسيكون مثل هذا:</p>
<pre><code translate="no" class="language-python"><span class="hljs-meta">@createDetails.command(<span class="hljs-params"><span class="hljs-string">&#x27;collection&#x27;</span></span>)</span>
<span class="hljs-meta">@click.argument(<span class="hljs-params"><span class="hljs-string">&#x27;collectionName&#x27;</span></span>)</span>
<span class="hljs-meta">@click.option(<span class="hljs-params"><span class="hljs-string">&#x27;-p&#x27;</span>, <span class="hljs-string">&#x27;--schema-primary-field&#x27;</span>, <span class="hljs-string">&#x27;primaryField&#x27;</span>, <span class="hljs-built_in">help</span>=<span class="hljs-string">&#x27;Primary field name.&#x27;</span>, default=<span class="hljs-string">&#x27;&#x27;</span></span>)</span>
<span class="hljs-meta">@click.option(<span class="hljs-params"><span class="hljs-string">&#x27;-a&#x27;</span>, <span class="hljs-string">&#x27;--schema-auto-id&#x27;</span>, <span class="hljs-string">&#x27;autoId&#x27;</span>, <span class="hljs-built_in">help</span>=<span class="hljs-string">&#x27;Enable auto id.&#x27;</span>, default=<span class="hljs-literal">False</span>, is_flag=<span class="hljs-literal">True</span></span>)</span>
<span class="hljs-meta">@click.pass_obj</span>
<span class="hljs-keyword">def</span> <span class="hljs-title function_">createCollection</span>(<span class="hljs-params">obj, collectionName, primaryField, autoId, description, fields</span>):
    <span class="hljs-keyword">pass</span>
<button class="copy-code-btn"></button></code></pre>
<p>ثم يجب أن يكون الاستخدام <code translate="no">cli create collection c_name -p p_name -a</code>.</p>
<h3 id="Add-full-help-message" class="common-anchor-header">إضافة رسالة تعليمات كاملة</h3><p>كما حددنا رسالة المساعدة القصيرة أعلاه، يمكننا تحديد رسالة المساعدة الكاملة في الدالة:</p>
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
<p>الكتلة الأولى داخل الدالة هي رسالة المساعدة التي ستتم طباعتها بعد أن ندخل <code translate="no">cli connect --help</code>.</p>
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
<h3 id="Add-confirm" class="common-anchor-header">إضافة تأكيد</h3><p>نحتاج أحيانًا إلى أن يقوم المستخدم بتأكيد بعض الإجراءات وخاصة حذف شيء ما. يمكننا إضافة <code translate="no">click.confirm</code> لإيقاف المستخدم مؤقتًا ونطلب منه التأكيد:</p>
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
<p>كما في المثال أعلاه، ستظهر محادثة تأكيد مثل <code translate="no">Aborted!ant to continue? [y/N]:</code>.</p>
<h3 id="Add-prompts" class="common-anchor-header">إضافة مطالبات</h3><p>لتنفيذ المطالبات نحتاج فقط إلى إضافة <code translate="no">click.prompt</code>.</p>
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
<p>ستظهر المطالبة عند كل <code translate="no">click.prompt</code>. نستخدم بعض المطالبات في سلسلة بحيث تبدو وكأنها محادثة مستمرة. هذا يضمن أن المستخدم سيدخل البيانات بالترتيب الذي نريده. في هذه الحالة نحتاج إلى أن يختار المستخدم مجموعة أولاً، ونحتاج إلى الحصول على جميع الأقسام ضمن هذه المجموعات، ثم نعرضها للمستخدم للاختيار.</p>
<h3 id="Add-choices" class="common-anchor-header">إضافة اختيارات</h3><p>في بعض الأحيان تريد أن يقوم المستخدم بإدخال نطاق/نوع محدود من القيمة، يمكنك إضافة <code translate="no">type=click.Choice([&lt;any&gt;])</code> إلى <code translate="no">click.prompt</code> و <code translate="no">click.options</code> وغيرها...</p>
<p>مثل,</p>
<pre><code translate="no" class="language-python">collectionName = click.prompt(
        <span class="hljs-string">&#x27;Collection name&#x27;</span>, <span class="hljs-built_in">type</span>=click.Choice([<span class="hljs-string">&#x27;collection_1&#x27;</span>, <span class="hljs-string">&#x27;collection_2&#x27;</span>]))
<button class="copy-code-btn"></button></code></pre>
<p>ثم يمكن للمستخدم فقط إدخال <code translate="no">collection_1</code> أو <code translate="no">collection_2</code> ، سيتم رفع الخطأ في حالة وجود أي مدخلات أخرى.</p>
<h3 id="Add-clear-screen" class="common-anchor-header">إضافة شاشة واضحة</h3><p>يمكنك استخدام <code translate="no">click.clear()</code> لتنفيذ ذلك.</p>
<pre><code translate="no" class="language-python"><span class="hljs-meta">@cli.command()</span>
<span class="hljs-keyword">def</span> <span class="hljs-title function_">clear</span>():
    <span class="hljs-string">&quot;&quot;&quot;Clear screen.&quot;&quot;&quot;</span>
    click.clear()
<button class="copy-code-btn"></button></code></pre>
<h3 id="Additional-tips" class="common-anchor-header">نصائح إضافية</h3><ul>
<li>القيمة الافتراضية هي <code translate="no">None</code> ، لذلك لا معنى لها إذا قمت بتحديد القيمة الافتراضية على أنها <code translate="no">None</code>. وستؤدي القيمة الافتراضية <code translate="no">None</code> إلى إظهار <code translate="no">click.prompt</code> باستمرار إذا كنت تريد ترك قيمة فارغة لتجاوزها.</li>
</ul>
<h2 id="Implement-prompt-CLI-for-user-to-input" class="common-anchor-header">تنفيذ مطالبة CLI للمستخدم بإدخال CLI<button data-href="#Implement-prompt-CLI-for-user-to-input" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Why-prompt-CLI" class="common-anchor-header">لماذا مطالبة CLI</h3><p>لتشغيل قاعدة البيانات، نحتاج إلى اتصال مستمر بمثيل. إذا استخدمنا وضع سطر الأوامر الأصلي، سيتم قطع الاتصال بعد كل أمر يتم تنفيذه. نريد أيضًا تخزين بعض البيانات عند استخدام CLI، وتنظيفها بعد الخروج.</p>
<h3 id="Implement" class="common-anchor-header">تنفيذ</h3><ol>
<li>استخدم <code translate="no">while True</code> للاستماع المستمر لمدخلات المستخدم.</li>
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
<li>سيؤدي استخدام <code translate="no">input</code> فقط إلى تحويل <code translate="no">up</code> و <code translate="no">down</code> و <code translate="no">left</code> و <code translate="no">right</code> مفاتيح الأسهم و <code translate="no">tab</code> وبعض المفاتيح الأخرى إلى سلسلة Acsii تلقائيًا. إلى جانب ذلك لا يمكن قراءة أوامر السجل من الجلسة. لذلك نضيف <code translate="no">readline</code> إلى الدالة <code translate="no">runCliPrompt</code>.</li>
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
<li>إضافة <code translate="no">quit</code> CLI.</li>
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
<li>قبض على خطأ <code translate="no">KeyboardInterrupt</code> عند استخدام <code translate="no">ctrl C</code> للخروج.</li>
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
<li>بعد تسوية كل شيء، تبدو CLI الآن مثل:</li>
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
<h2 id="Manually-implement-autocomplete" class="common-anchor-header">تنفيذ الإكمال التلقائي يدويًا<button data-href="#Manually-implement-autocomplete" class="anchor-icon" translate="no">
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
    </button></h2><p>يختلف مشروعنا عن الإكمال التلقائي لصدفة النقر، حيث يقوم مشروعنا بلف سطر الأوامر واستخدام حلقة للحصول على مدخلات المستخدم لتنفيذ سطر الأوامر الفوري. لذلك نحن بحاجة إلى ربط الإكمال التلقائي بـ <code translate="no">readline</code>.</p>
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
<p>بعد تعريف <code translate="no">Completer</code> يمكننا ربطه بـ readline:</p>
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
<h2 id="Add-one-time-option" class="common-anchor-header">إضافة خيار لمرة واحدة<button data-href="#Add-one-time-option" class="anchor-icon" translate="no">
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
    </button></h2><p>بالنسبة لسطر الأوامر الموجهة، في بعض الأحيان لا نريد أن ندخل بشكل كامل إلى البرامج النصية للحصول على بعض المعلومات مثل الإصدار. مثال جيد على ذلك هو <code translate="no">Python</code> ، عندما تكتب <code translate="no">python</code> في المحطة الطرفية سيظهر سطر الأوامر Promtp، لكنه يُرجع رسالة إصدار فقط ولن يدخل إلى البرامج النصية السريعة إذا كتبت <code translate="no">python -V</code>. لذلك يمكننا استخدام <code translate="no">sys.args</code> في التعليمات البرمجية الخاصة بنا للتنفيذ.</p>
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
<p>نحصل على <code translate="no">sys.args</code> قبل الحلقة عند التشغيل لأول مرة في البرامج النصية لـ CLI. إذا كانت الوسيطة الأخيرة هي <code translate="no">--version</code> ، فإن الكود سيعيد إصدار الحزمة دون الدخول في حلقة.</p>
<p>سيكون ذلك مفيدًا بعد أن نبني الأكواد كحزمة. يمكن للمستخدم أن يكتب <code translate="no">milvus_cli</code> للانتقال إلى CLI موجهة، أو اكتب <code translate="no">milvus_cli --version</code> للحصول على الإصدار فقط.</p>
<h2 id="Build-and-release" class="common-anchor-header">البناء والإصدار<button data-href="#Build-and-release" class="anchor-icon" translate="no">
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
    </button></h2><p>أخيرًا نريد بناء حزمة وإصدارها بواسطة PYPI. بحيث يمكن للمستخدم ببساطة استخدام <code translate="no">pip install &lt;package name&gt;</code> للتثبيت.</p>
<h3 id="Install-locally-for-test" class="common-anchor-header">تثبيت محلي للاختبار</h3><p>قبل أن تقوم بنشر الحزمة على PYPI، قد ترغب في تثبيتها محليًا لبعض الاختبارات.</p>
<p>في هذه الحالة، يمكنك ببساطة <code translate="no">cd</code> في دليل الحزمة وتشغيل <code translate="no">pip install -e .</code> (لا تنسى <code translate="no">.</code>).</p>
<h3 id="Create-package-files" class="common-anchor-header">إنشاء ملفات الحزمة</h3><p>ارجع إلى: https://packaging.python.org/tutorials/packaging-projects/</p>
<p>يجب أن تبدو بنية الحزمة كما يلي:</p>
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
<h4 id="Create-the-package-directory" class="common-anchor-header">إنشاء دليل الحزمة</h4><p>قم بإنشاء دليل <code translate="no">Milvus_cli</code> بالهيكل أدناه:</p>
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
<h4 id="Write-the-entry-code" class="common-anchor-header">اكتب رمز الإدخال</h4><p>يجب أن يكون إدخال النص البرمجي في <code translate="no">Milvus_cli/milvus_cli/scripts</code> ، ويجب أن يكون <code translate="no">Milvus_cli/milvus_cli/scripts/milvus_cli.py</code> مثل:</p>
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
<h4 id="Edit-the-setuppy" class="common-anchor-header">تحرير <code translate="no">setup.py</code></h4><pre><code translate="no" class="language-python"><span class="hljs-keyword">from</span> setuptools <span class="hljs-keyword">import</span> setup, find_packages

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
<p>بعض النصائح هنا:</p>
<ol>
<li>نستخدم محتوى <code translate="no">README.md</code> كوصف طويل للحزمة.</li>
<li>أضف جميع التبعيات إلى <code translate="no">install_requires</code>.</li>
<li>حدد ال <code translate="no">entry_points</code>. في هذه الحالة، نقوم بتعيين <code translate="no">milvus_cli</code> كتابع لـ <code translate="no">console_scripts</code> ، بحيث يمكننا كتابة <code translate="no">milvus_cli</code> كأمر مباشرة بعد تثبيت هذه الحزمة. ونقطة الدخول <code translate="no">milvus_cli</code> هي الدالة <code translate="no">runCliPrompt</code> في <code translate="no">milvus_cli/scripts/milvus_cli.py</code>.</li>
</ol>
<h4 id="Build" class="common-anchor-header">بناء</h4><ol>
<li><p>قم بترقية الحزمة <code translate="no">build</code>: <code translate="no">python3 -m pip install --upgrade build</code></p></li>
<li><p>قم بتشغيل الإنشاء: <code translate="no">python -m build --sdist --wheel --outdir dist/ .</code></p></li>
<li><p>سيتم إنشاء ملفين ضمن الدليل <code translate="no">dist/</code>:</p></li>
</ol>
<pre><code translate="no" class="language-shell">dist/
  example_package_YOUR_USERNAME_HERE-<span class="hljs-number">0.0</span><span class="hljs-number">.1</span>-py3-none-<span class="hljs-built_in">any</span>.whl
  example_package_YOUR_USERNAME_HERE-<span class="hljs-number">0.0</span><span class="hljs-number">.1</span>.tar.gz
<button class="copy-code-btn"></button></code></pre>
<h3 id="Publish-release" class="common-anchor-header">نشر الإصدار</h3><p>الرجوع إلى: https://packaging.python.org/tutorials/packaging-projects/#uploading-the-distribution-archives</p>
<ol>
<li>ترقية الحزمة <code translate="no">twine</code>: <code translate="no">python3 -m pip install --upgrade twine</code></li>
<li>قم بالتحميل إلى <code translate="no">PYPI</code> اختبار البيئة : <code translate="no">python3 -m twine upload --repository testpypi dist/*</code></li>
<li>تحميل إلى <code translate="no">PYPI</code>: <code translate="no">python3 -m twine upload dist/*</code></li>
</ol>
<h3 id="CICD-by-Github-workflows" class="common-anchor-header">CI / CD بواسطة سير عمل Github</h3><p>الرجوع إلى: https://packaging.python.org/guides/publishing-package-distribution-releases-using-github-actions-ci-cd-workflows/</p>
<p>نريد طريقة لتحميل الأصول تلقائيًا، ويمكنه بناء الحزم وتحميلها إلى إصدارات github و PYPI.</p>
<p>(لسبب ما نريد فقط سير العمل فقط نشر الإصدار لاختبار PYPI).</p>
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
<h2 id="Learn-more-about-Milvus" class="common-anchor-header">تعرف على المزيد حول ميلفوس<button data-href="#Learn-more-about-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus أداة قوية قادرة على تشغيل مجموعة واسعة من تطبيقات الذكاء الاصطناعي والبحث عن التشابه المتجه. لمعرفة المزيد عن المشروع، اطلع على الموارد التالية:</p>
<ul>
<li>اقرأ <a href="https://milvus.io/blog">مدونتنا</a>.</li>
<li>تفاعل مع مجتمعنا مفتوح المصدر على <a href="https://milvusio.slack.com/join/shared_invite/zt-e0u4qu3k-bI2GDNys3ZqX1YCJ9OM~GQ#/shared-invite/email">Slack</a>.</li>
<li>استخدم أو ساهم في قاعدة بيانات المتجهات الأكثر شعبية في العالم على <a href="https://github.com/milvus-io/milvus/">GitHub</a>.</li>
<li>اختبار تطبيقات الذكاء الاصطناعي ونشرها بسرعة من خلال <a href="https://github.com/milvus-io/bootcamp">معسكرنا التدريبي</a> الجديد.</li>
</ul>
