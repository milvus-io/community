---
id: embedded-milvus.md
title: >-
  Использование Embedded Milvus для мгновенной установки и запуска Milvus с
  Python
author: Alex Gao
date: 2022-08-15T00:00:00.000Z
desc: 'Удобная версия Milvus для Python, которая делает установку более гибкой.'
cover: assets.zilliz.com/embeddded_milvus_1_8132468cac.png
tag: Engineering
tags: 'Vector Database for AI, Artificial Intelligence, Machine Learning'
canonicalUrl: 'https://milvus.io/blog/embedded-milvus.md'
---
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/embeddded_milvus_1_8132468cac.png" alt="Cover" class="doc-image" id="cover" />
   </span> <span class="img-wrapper"> <span>Обложка</span> </span></p>
<blockquote>
<p>Эта статья написана в соавторстве с <a href="https://github.com/soothing-rain/">Алексом Гао</a> и <a href="https://www.linkedin.com/in/yiyun-n-2aa713163/">Анджелой Ни</a>.</p>
</blockquote>
<p>Milvus - это векторная база данных с открытым исходным кодом для приложений искусственного интеллекта. Он предлагает различные способы установки, включая сборку из исходного кода и установку Milvus с помощью Docker Compose/Helm/APT/YUM/Ansible. Пользователи могут выбрать один из способов установки в зависимости от своей операционной системы и предпочтений. Однако в сообществе Milvus есть много специалистов по изучению данных и инженеров по искусственному интеллекту, которые работают с Python и жаждут более простого метода установки, чем те, что доступны сейчас.</p>
<p>Поэтому вместе с Milvus 2.1 мы выпустили embedded Milvus - версию, удобную для работы с Python, чтобы расширить возможности разработчиков на Python в нашем сообществе. В этой статье рассказывается о том, что такое встроенный Milvus, и приводятся инструкции по его установке и использованию.</p>
<p><strong>Перейти к:</strong></p>
<ul>
<li><a href="#An-overview-of-embedded-Milvus">Обзор встроенного Milvus</a><ul>
<li><a href="#When-to-use-embedded-Milvus">Когда использовать встроенный Milvus?</a></li>
<li><a href="#A-comparison-of-different-modes-of-Milvus">Сравнение различных режимов Milvus</a></li>
</ul></li>
<li><a href="#How-to-install-embedded-Milvus">Как установить встроенный Milvus</a></li>
<li><a href="#Start-and-stop-embedded-Milvus">Запуск и остановка встроенного Milvus</a></li>
</ul>
<h2 id="An-overview-of-embedded-Milvus" class="common-anchor-header">Обзор встроенного Milvus<button data-href="#An-overview-of-embedded-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://github.com/milvus-io/embd-milvus">Встроенный Milvus</a> позволяет быстро установить и использовать Milvus с Python. Он может быстро создать экземпляр Milvus и позволяет запускать и останавливать службу Milvus в любое время. Все данные и журналы сохраняются, даже если вы остановите встроенный Milvus.</p>
<p>Сам встроенный Milvus не имеет внутренних зависимостей и не требует предварительной установки и запуска сторонних зависимостей, таких как etcd, MinIO, Pulsar и т. д.</p>
<p>Все, что вы делаете со встроенным Milvus, и каждый кусок кода, написанный для него, может быть безопасно перенесен в другие режимы Milvus - автономный, кластерный, облачную версию и т. д. Это отражает одну из самых характерных особенностей встроенного Milvus - <strong>"Write once, run anywhere".</strong></p>
<h3 id="When-to-use-embedded-Milvus" class="common-anchor-header">Когда использовать встраиваемый Milvus?</h3><p>Встроенный Milvus и <a href="https://milvus.io/docs/v2.1.x/install-pymilvus.md">PyMilvus</a> созданы для разных целей. Вы можете выбрать встроенный Milvus в следующих сценариях:</p>
<ul>
<li><p>Вы хотите использовать Milvus без установки Milvus любым из представленных <a href="https://milvus.io/docs/v2.1.x/install_standalone-docker.md">здесь</a> способов.</p></li>
<li><p>Вы хотите использовать Milvus без длительного запуска процесса Milvus на вашей машине.</p></li>
<li><p>Вы хотите быстро использовать Milvus без запуска отдельного процесса Milvus и других необходимых компонентов, таких как etcd, MinIO, Pulsar и т. д.</p></li>
</ul>
<p>Рекомендуется <strong>НЕ</strong> использовать встроенный Milvus:</p>
<ul>
<li><p>В производственной среде.<em>(Чтобы использовать Milvus для производства, рассмотрите кластер Milvus или <a href="https://zilliz.com/cloud">облако Zilliz</a>, полностью управляемый сервис Milvus</em>)<em>.</em></p></li>
<li><p>Если у вас высокие требования к производительности.<em>(Если говорить сравнительно, то встроенный Milvus может не обеспечить наилучшую производительность</em>)<em>.</em></p></li>
</ul>
<h3 id="A-comparison-of-different-modes-of-Milvus" class="common-anchor-header">Сравнение различных режимов Milvus</h3><p>В таблице ниже приведено сравнение нескольких режимов работы Milvus: автономный, кластерный, встроенный Milvus и облако Zilliz, полностью управляемый сервис Milvus.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/comparison_ebcd7c5b07.jpeg" alt="comparison" class="doc-image" id="comparison" />
   </span> <span class="img-wrapper"> <span>сравнение</span> </span></p>
<h2 id="How-to-install-embedded-Milvus" class="common-anchor-header">Как установить встроенный Milvus?<button data-href="#How-to-install-embedded-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Перед установкой встраиваемого Milvus необходимо убедиться, что у вас установлен Python 3.6 или более поздней версии. Встраиваемый Milvus поддерживает следующие операционные системы:</p>
<ul>
<li><p>Ubuntu 18.04</p></li>
<li><p>Mac x86_64 &gt;= 10.4</p></li>
<li><p>Mac M1 &gt;= 11.0</p></li>
</ul>
<p>Если все требования выполнены, вы можете запустить <code translate="no">$ python3 -m pip install milvus</code> для установки встроенного Milvus. Вы также можете добавить версию в команду, чтобы установить определенную версию встроенного Milvus. Например, если вы хотите установить версию 2.1.0, выполните команду <code translate="no">$ python3 -m pip install milvus==2.1.0</code>. В дальнейшем, когда выйдет новая версия встроенного Milvus, вы также можете выполнить команду <code translate="no">$ python3 -m pip install --upgrade milvus</code>, чтобы обновить встроенный Milvus до последней версии.</p>
<p>Если вы старый пользователь Milvus, который уже установил PyMilvus ранее и хочет установить встроенный Milvus, вы можете запустить <code translate="no">$ python3 -m pip install --no-deps milvus</code>.</p>
<p>После выполнения команды установки необходимо создать папку данных для встроенного Milvus в каталоге <code translate="no">/var/bin/e-milvus</code>, выполнив следующую команду:</p>
<pre><code translate="no"><span class="hljs-built_in">sudo</span> <span class="hljs-built_in">mkdir</span> -p /var/bin/e-milvus
<span class="hljs-built_in">sudo</span> <span class="hljs-built_in">chmod</span> -R 777 /var/bin/e-milvus
<button class="copy-code-btn"></button></code></pre>
<h2 id="Start-and-stop-embedded-Milvus" class="common-anchor-header">Запуск и остановка встроенного Milvus<button data-href="#Start-and-stop-embedded-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>После успешной установки вы можете запустить службу.</p>
<p>Если вы запускаете встроенный Milvus в первый раз, сначала необходимо импортировать Milvus и настроить встроенный Milvus.</p>
<pre><code translate="no">$ python3
Python 3.9.10 (main, Jan 15 2022, 11:40:53)
[Clang 13.0.0 (clang-1300.0.29.3)] on darwin
Type <span class="hljs-string">&quot;help&quot;</span>, <span class="hljs-string">&quot;copyright&quot;</span>, <span class="hljs-string">&quot;credits&quot;</span> or <span class="hljs-string">&quot;license&quot;</span> <span class="hljs-keyword">for</span> more information.
&gt;&gt;&gt; import milvus
&gt;&gt;&gt; milvus.before()
please <span class="hljs-keyword">do</span> the following <span class="hljs-keyword">if</span> you have not already <span class="hljs-keyword">done</span> so:
1. install required dependencies: bash /var/bin/e-milvus/lib/install_deps.sh
2. <span class="hljs-built_in">export</span> LD_PRELOAD=/SOME_PATH/embd-milvus.so
3. <span class="hljs-built_in">export</span> LD_LIBRARY_PATH=<span class="hljs-variable">$LD_LIBRARY_PATH</span>:/usr/lib:/usr/local/lib:/var/bin/e-milvus/lib/
&gt;&gt;&gt;
<button class="copy-code-btn"></button></code></pre>
<p>Если вы уже успешно запускали встроенный Milvus ранее и вернулись, чтобы перезапустить его, вы можете напрямую запустить <code translate="no">milvus.start()</code> после импорта Milvus.</p>
<pre><code translate="no">$ python3
Python <span class="hljs-number">3.9</span><span class="hljs-number">.10</span> (main, Jan <span class="hljs-number">15</span> <span class="hljs-number">2022</span>, <span class="hljs-number">11</span>:<span class="hljs-number">40</span>:<span class="hljs-number">53</span>)
[Clang <span class="hljs-number">13.0</span><span class="hljs-number">.0</span> (clang-<span class="hljs-number">1300.0</span><span class="hljs-number">.29</span><span class="hljs-number">.3</span>)] on darwinType <span class="hljs-string">&quot;help&quot;</span>, <span class="hljs-string">&quot;copyright&quot;</span>, <span class="hljs-string">&quot;credits&quot;</span> <span class="hljs-keyword">or</span> <span class="hljs-string">&quot;license&quot;</span> <span class="hljs-keyword">for</span> more information.
<span class="hljs-meta">&gt;&gt;&gt; </span><span class="hljs-keyword">import</span> milvus
<span class="hljs-meta">&gt;&gt;&gt; </span>milvus.start()
&gt;&gt;&gt;
<button class="copy-code-btn"></button></code></pre>
<p>Вы увидите следующий результат, если вы успешно запустили службу встроенного Milvus.</p>
<pre><code translate="no">---<span class="hljs-title class_">Milvus</span> <span class="hljs-title class_">Proxy</span> successfully initialized and ready to serve!---
<button class="copy-code-btn"></button></code></pre>
<p>После запуска службы вы можете запустить другое окно терминала и запустить код примера &quot;<a href="https://github.com/milvus-io/embd-milvus/blob/main/milvus/examples/hello_milvus.py">Hello Milvus</a>&quot;, чтобы поиграть со встроенным Milvus!</p>
<pre><code translate="no"><span class="hljs-comment"># Download hello_milvus script</span>
$ wget https://raw.githubusercontent.com/milvus-io/pymilvus/v2.1.0/examples/hello_milvus.py
<span class="hljs-comment"># Run Hello Milvus </span>
$ python3 hello_milvus.py
<button class="copy-code-btn"></button></code></pre>
<p>Когда вы закончите использовать встроенный Milvus, мы рекомендуем изящно завершить его работу и очистить переменные окружения, выполнив следующую команду или нажав Ctrl-D.</p>
<pre><code translate="no">&gt;&gt;&gt; milvus.stop()
<span class="hljs-keyword">if</span> you need to clean up the environment variables, run:
<span class="hljs-built_in">export</span> LD_PRELOAD=
<span class="hljs-built_in">export</span> LD_LIBRARY_PATH=
&gt;&gt;&gt;
&gt;&gt;&gt; <span class="hljs-built_in">exit</span>()
<button class="copy-code-btn"></button></code></pre>
<h2 id="Whats-next" class="common-anchor-header">Что дальше<button data-href="#Whats-next" class="anchor-icon" translate="no">
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
    </button></h2><p>После официального выхода Milvus 2.1 мы подготовили серию блогов, в которых рассказываем о новых возможностях. Читайте подробнее в этой серии блогов:</p>
<ul>
<li><a href="https://milvus.io/blog/2022-08-08-How-to-use-string-data-to-empower-your-similarity-search-applications.md">Как использовать строковые данные для расширения возможностей приложений поиска по сходству</a></li>
<li><a href="https://milvus.io/blog/embedded-milvus.md">Использование Embedded Milvus для мгновенной установки и запуска Milvus с Python</a></li>
<li><a href="https://milvus.io/blog/in-memory-replicas.md">Увеличение пропускной способности базы данных Vector с помощью реплик в памяти</a></li>
<li><a href="https://milvus.io/blog/understanding-consistency-levels-in-the-milvus-vector-database.md">Понимание уровня согласованности в векторной базе данных Milvus</a></li>
<li><a href="https://milvus.io/blog/understanding-consistency-levels-in-the-milvus-vector-database-2.md">Понимание уровня согласованности в векторной базе данных Milvus (часть II)</a></li>
<li><a href="https://milvus.io/blog/data-security.md">Как база данных Milvus Vector обеспечивает безопасность данных?</a></li>
</ul>
