---
id: embedded-milvus.md
title: استخدام ميلفوس المدمج لتثبيت وتشغيل ميلفوس مع بايثون على الفور
author: Alex Gao
date: 2022-08-15T00:00:00.000Z
desc: نسخة ميلفوس سهلة الاستخدام من بايثون تجعل التثبيت أكثر مرونة.
cover: assets.zilliz.com/embeddded_milvus_1_8132468cac.png
tag: Engineering
tags: 'Vector Database for AI, Artificial Intelligence, Machine Learning'
canonicalUrl: 'https://milvus.io/blog/embedded-milvus.md'
---
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/embeddded_milvus_1_8132468cac.png" alt="Cover" class="doc-image" id="cover" />
   </span> <span class="img-wrapper"> <span>الغلاف</span> </span></p>
<blockquote>
<p>شارك في تأليف هذه المقالة <a href="https://github.com/soothing-rain/">أليكس جاو</a> <a href="https://www.linkedin.com/in/yiyun-n-2aa713163/">وأنجيلا ني</a>.</p>
</blockquote>
<p>Milvus هي قاعدة بيانات متجهة مفتوحة المصدر لتطبيقات الذكاء الاصطناعي. يوفر مجموعة متنوعة من طرق التثبيت بما في ذلك البناء من التعليمات البرمجية المصدرية، وتثبيت Milvus باستخدام Docker Compose/Helm/APT/YUM/Ansible. يمكن للمستخدمين اختيار إحدى طرق التثبيت حسب أنظمة التشغيل والتفضيلات الخاصة بهم. ومع ذلك، هناك العديد من علماء البيانات ومهندسي الذكاء الاصطناعي في مجتمع Milvus الذين يعملون مع Python ويتوقون إلى طريقة تثبيت أبسط بكثير من تلك المتاحة حاليًا.</p>
<p>ولذلك، أصدرنا Milvus المدمج Milvus، وهو إصدار سهل الاستخدام من Python، إلى جانب Milvus 2.1 لتمكين المزيد من مطوري Python في مجتمعنا. تقدم هذه المقالة ما هو ميلفوس المدمج وتوفر إرشادات حول كيفية تثبيته واستخدامه.</p>
<p><strong>انتقل إلى:</strong></p>
<ul>
<li><a href="#An-overview-of-embedded-Milvus">نظرة عامة على ميلفوس المدمج</a><ul>
<li><a href="#When-to-use-embedded-Milvus">متى تستخدم ميلفوس المدمج؟</a></li>
<li><a href="#A-comparison-of-different-modes-of-Milvus">مقارنة بين الأنماط المختلفة لملفوس المضمنة</a></li>
</ul></li>
<li><a href="#How-to-install-embedded-Milvus">كيفية تثبيت ميلفوس المضمّن</a></li>
<li><a href="#Start-and-stop-embedded-Milvus">بدء تشغيل وإيقاف ميلفوس المضمّن</a></li>
</ul>
<h2 id="An-overview-of-embedded-Milvus" class="common-anchor-header">نظرة عامة على ميلفوس المضمّن<button data-href="#An-overview-of-embedded-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>يمكّنك ميلفوس<a href="https://github.com/milvus-io/embd-milvus">المضمّن</a> من تثبيت واستخدام ميلفوس مع بايثون بسرعة. ويمكنه إحضار مثيل Milvus بسرعة ويسمح لك ببدء تشغيل خدمة Milvus وإيقافها متى أردت ذلك. يتم الاحتفاظ بجميع البيانات والسجلات حتى لو قمت بإيقاف Milvus المدمج.</p>
<p>لا يحتوي Milvus المضمّن Milvus نفسه على أي تبعيات داخلية ولا يتطلب تثبيت وتشغيل أي تبعيات تابعة لجهات خارجية مثل etcd و MinIO و Pulsar وغيرها.</p>
<p>كل ما تفعله مع Milvus المدمج، وكل جزء من التعليمات البرمجية التي تكتبها له يمكن ترحيله بأمان إلى أوضاع Milvus الأخرى - الإصدار المستقل أو العنقودي أو السحابي وما إلى ذلك. وهذا يعكس واحدة من أكثر السمات المميزة لـ Milvus المدمج - <strong>"اكتب مرة واحدة، وشغّلها في أي مكان".</strong></p>
<h3 id="When-to-use-embedded-Milvus" class="common-anchor-header">متى تستخدم ميلفوس المدمج؟</h3><p>يتم إنشاء Milvus المدمج و <a href="https://milvus.io/docs/v2.1.x/install-pymilvus.md">PyMilvus</a> المدمج لأغراض مختلفة. يمكنك التفكير في اختيار Milvus المدمج في السيناريوهات التالية:</p>
<ul>
<li><p>تريد استخدام Milvus دون تثبيت Milvus بأي من الطرق المتوفرة <a href="https://milvus.io/docs/v2.1.x/install_standalone-docker.md">هنا</a>.</p></li>
<li><p>تريد استخدام Milvus دون الاحتفاظ بعملية Milvus طويلة الأمد في جهازك.</p></li>
<li><p>كنت تريد استخدام Milvus بسرعة دون بدء عملية Milvus منفصلة ومكونات أخرى مطلوبة مثل etcd و MinIO و Pulsar وغيرها.</p></li>
</ul>
<p>يُقترح <strong>ألا</strong> تستخدم ميلفوس المدمج:</p>
<ul>
<li><p>في بيئة الإنتاج.<em>(لاستخدام Milvus للإنتاج، فكّر في مجموعة Milvus العنقودية أو <a href="https://zilliz.com/cloud">سحابة Zilliz،</a> وهي خدمة Milvus مُدارة بالكامل</em>).</p></li>
<li><p>إذا كان لديك طلب كبير على الأداء.<em>(نسبيًا، قد لا يوفر Milvus المدمج أفضل أداء</em>).</p></li>
</ul>
<h3 id="A-comparison-of-different-modes-of-Milvus" class="common-anchor-header">مقارنة بين أنماط مختلفة من ميلفوس</h3><p>يقارن الجدول أدناه بين عدة أنماط من ميلفوس: ميلفوس المستقل، العنقودي، ميلفوس المدمج، وخدمة Zilliz Cloud، وهي خدمة ميلفوس المدارة بالكامل.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/comparison_ebcd7c5b07.jpeg" alt="comparison" class="doc-image" id="comparison" />
   </span> <span class="img-wrapper"> <span>المقارنة</span> </span></p>
<h2 id="How-to-install-embedded-Milvus" class="common-anchor-header">كيفية تثبيت ميلفوس المدمج؟<button data-href="#How-to-install-embedded-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>قبل تثبيت ميلفوس المدمج، يجب عليك أولاً التأكد من تثبيت Python 3.6 أو أحدث. يدعم ميلفوس المدمج أنظمة التشغيل التالية:</p>
<ul>
<li><p>أوبونتو 18.04</p></li>
<li><p>نظام ماك x86_64 &gt;= 10.4</p></li>
<li><p>ماك M1 &gt;= 11.0</p></li>
</ul>
<p>إذا تم استيفاء المتطلبات، يمكنك تشغيل <code translate="no">$ python3 -m pip install milvus</code> لتثبيت Milvus المدمج. يمكنك أيضًا إضافة الإصدار في الأمر لتثبيت إصدار معين من Milvus المدمج. على سبيل المثال، إذا كنت تريد تثبيت الإصدار 2.1.0، فقم بتشغيل <code translate="no">$ python3 -m pip install milvus==2.1.0</code>. وفي وقت لاحق عندما يتم إصدار إصدار إصدار جديد من Milvus المضمن، يمكنك أيضًا تشغيل <code translate="no">$ python3 -m pip install --upgrade milvus</code> لترقية Milvus المضمن إلى أحدث إصدار.</p>
<p>إذا كنت مستخدمًا قديمًا لـ Milvus وقمت بالفعل بتثبيت PyMilvus من قبل وتريد تثبيت Milvus المضمن، يمكنك تشغيل <code translate="no">$ python3 -m pip install --no-deps milvus</code>.</p>
<p>بعد تشغيل أمر التثبيت، تحتاج إلى إنشاء مجلد بيانات لـ Milvus المضمن ضمن <code translate="no">/var/bin/e-milvus</code> عن طريق تشغيل الأمر التالي:</p>
<pre><code translate="no"><span class="hljs-built_in">sudo</span> <span class="hljs-built_in">mkdir</span> -p /var/bin/e-milvus
<span class="hljs-built_in">sudo</span> <span class="hljs-built_in">chmod</span> -R 777 /var/bin/e-milvus
<button class="copy-code-btn"></button></code></pre>
<h2 id="Start-and-stop-embedded-Milvus" class="common-anchor-header">بدء وإيقاف ميلفوس المدمج<button data-href="#Start-and-stop-embedded-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>عند نجاح التثبيت، يمكنك بدء تشغيل الخدمة.</p>
<p>إذا كنت تقوم بتشغيل خدمة Milvus المضمنة للمرة الأولى، فأنت بحاجة إلى استيراد Milvus وإعداد Milvus المضمنة أولاً.</p>
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
<p>إذا كنت قد بدأت تشغيل Milvus المضمن بنجاح من قبل وعدت لإعادة تشغيله، يمكنك تشغيل <code translate="no">milvus.start()</code> مباشرةً بعد استيراد Milvus.</p>
<pre><code translate="no">$ python3
Python <span class="hljs-number">3.9</span><span class="hljs-number">.10</span> (main, Jan <span class="hljs-number">15</span> <span class="hljs-number">2022</span>, <span class="hljs-number">11</span>:<span class="hljs-number">40</span>:<span class="hljs-number">53</span>)
[Clang <span class="hljs-number">13.0</span><span class="hljs-number">.0</span> (clang-<span class="hljs-number">1300.0</span><span class="hljs-number">.29</span><span class="hljs-number">.3</span>)] on darwinType <span class="hljs-string">&quot;help&quot;</span>, <span class="hljs-string">&quot;copyright&quot;</span>, <span class="hljs-string">&quot;credits&quot;</span> <span class="hljs-keyword">or</span> <span class="hljs-string">&quot;license&quot;</span> <span class="hljs-keyword">for</span> more information.
<span class="hljs-meta">&gt;&gt;&gt; </span><span class="hljs-keyword">import</span> milvus
<span class="hljs-meta">&gt;&gt;&gt; </span>milvus.start()
&gt;&gt;&gt;
<button class="copy-code-btn"></button></code></pre>
<p>سترى الإخراج التالي إذا كنت قد بدأت تشغيل خدمة Milvus المضمنة بنجاح.</p>
<pre><code translate="no">---<span class="hljs-title class_">Milvus</span> <span class="hljs-title class_">Proxy</span> successfully initialized and ready to serve!---
<button class="copy-code-btn"></button></code></pre>
<p>بعد بدء تشغيل الخدمة، يمكنك بدء تشغيل نافذة طرفية أخرى وتشغيل مثال التعليمات البرمجية لـ &quot;<a href="https://github.com/milvus-io/embd-milvus/blob/main/milvus/examples/hello_milvus.py">Hello Milvus</a>&quot; للتلاعب بـ Milvus المضمن!</p>
<pre><code translate="no"><span class="hljs-comment"># Download hello_milvus script</span>
$ wget https://raw.githubusercontent.com/milvus-io/pymilvus/v2.1.0/examples/hello_milvus.py
<span class="hljs-comment"># Run Hello Milvus </span>
$ python3 hello_milvus.py
<button class="copy-code-btn"></button></code></pre>
<p>عند الانتهاء من استخدام خدمة Milvus المضمنة، نوصي بإيقافها بأمان وتنظيف متغيرات البيئة عن طريق تشغيل الأمر التالي أو الضغط على Ctrl-D.</p>
<pre><code translate="no">&gt;&gt;&gt; milvus.stop()
<span class="hljs-keyword">if</span> you need to clean up the environment variables, run:
<span class="hljs-built_in">export</span> LD_PRELOAD=
<span class="hljs-built_in">export</span> LD_LIBRARY_PATH=
&gt;&gt;&gt;
&gt;&gt;&gt; <span class="hljs-built_in">exit</span>()
<button class="copy-code-btn"></button></code></pre>
<h2 id="Whats-next" class="common-anchor-header">ما التالي<button data-href="#Whats-next" class="anchor-icon" translate="no">
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
    </button></h2><p>مع الإصدار الرسمي لـ Milvus 2.1، أعددنا سلسلة من المدونات التي تقدم الميزات الجديدة. اقرأ المزيد في سلسلة المدونات هذه:</p>
<ul>
<li><a href="https://milvus.io/blog/2022-08-08-How-to-use-string-data-to-empower-your-similarity-search-applications.md">كيفية استخدام بيانات السلسلة لتمكين تطبيقات البحث عن التشابه لديك</a></li>
<li><a href="https://milvus.io/blog/embedded-milvus.md">استخدام ميلفوس المدمج لتثبيت وتشغيل ميلفوس مع بايثون على الفور</a></li>
<li><a href="https://milvus.io/blog/in-memory-replicas.md">زيادة إنتاجية قراءة قاعدة بيانات المتجهات باستخدام النسخ المتماثلة في الذاكرة</a></li>
<li><a href="https://milvus.io/blog/understanding-consistency-levels-in-the-milvus-vector-database.md">فهم مستوى الاتساق في قاعدة بيانات Milvus Vector في قاعدة بيانات Milvus</a></li>
<li><a href="https://milvus.io/blog/understanding-consistency-levels-in-the-milvus-vector-database-2.md">فهم مستوى الاتساق في قاعدة بيانات Milvus Vector (الجزء الثاني)</a></li>
<li><a href="https://milvus.io/blog/data-security.md">كيف تضمن قاعدة بيانات Milvus Vector أمان البيانات؟</a></li>
</ul>
