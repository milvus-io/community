---
id: introducing-milvus-lite-lightweight-version-of-milvus.md
title: 'نقدم لك Milvus Lite: الإصدار الخفيف الوزن من Milvus'
author: Fendy Feng
date: 2023-05-23T00:00:00.000Z
desc: >-
  اختبر سرعة وكفاءة Milvus Lite، وهو البديل خفيف الوزن لقاعدة بيانات Milvus
  vector الشهيرة للبحث عن التشابه بسرعة البرق.
cover: assets.zilliz.com/introducing_Milvus_Lite_7c0d0a1174.jpeg
tag: News
tags: >-
  Milvus, Vector Database, Open Source, Data science, Artificial Intelligence,
  Vector Management
recommend: true
canonicalUrl: >-
  https://milvus.io/blog/introducing-milvus-lite-lightweight-version-of-milvus.md
---
<p><strong><em>ملاحظة مهمة</em></strong></p>
<p><em>لقد قمنا بترقية Milvus Lite في يونيو 2024، مما يتيح لمطوري الذكاء الاصطناعي إنشاء تطبيقات أسرع مع ضمان تجربة متسقة عبر خيارات النشر المختلفة، بما في ذلك Milvus على Kurbernetes وDocker والخدمات السحابية المُدارة. يتكامل Milvus Lite أيضًا مع العديد من أطر وتقنيات الذكاء الاصطناعي، مما يسهّل تطوير تطبيقات الذكاء الاصطناعي مع إمكانات البحث المتجه. لمزيد من المعلومات، راجع المراجع التالية:</em></p>
<ul>
<li><p><em>مدونة إطلاق ميلفوس لايت: h<a href="https://milvus.io/blog/introducing-milvus-lite.md">ttps://</a>milvus.io/blog/introducing-milvus-lite.md</em></p></li>
<li><p><em>وثائق ميلفوس لايت: <a href="https://milvus.io/docs/quickstart.md">https://milvus.io/docs/quickstart.md</a></em></p></li>
<li><p><em>مستودع ميلفوس لايت في جيثب: <a href="https://github.com/milvus-io/milvus-lite">https://github.com/milvus-io/milvus-lite</a></em></p></li>
</ul>
<p><br></p>
<p><a href="https://github.com/milvus-io/milvus">Milvus</a> عبارة عن قاعدة بيانات متجهة مفتوحة المصدر مصممة خصيصًا لفهرسة متجهات التضمين وتخزينها والاستعلام عنها التي تم إنشاؤها بواسطة الشبكات العصبية العميقة ونماذج التعلم الآلي الأخرى بمليارات المقاييس. لقد أصبح خيارًا شائعًا للعديد من الشركات والباحثين والمطورين الذين يجب عليهم إجراء عمليات بحث عن التشابه على مجموعات بيانات واسعة النطاق.</p>
<p>ومع ذلك، قد يجد بعض المستخدمين أن الإصدار الكامل من ميلفوس ثقيل أو معقد للغاية. ولمعالجة هذه المشكلة، قام <a href="https://github.com/matrixji">بن جي،</a> أحد أكثر المساهمين نشاطًا في مجتمع ميلفوس، ببناء <a href="https://github.com/milvus-io/milvus-lite">ميلفوس لا</a>يت، وهو نسخة خفيفة الوزن من ميلفوس.</p>
<h2 id="What-is-Milvus-Lite" class="common-anchor-header">ما هو ميلفوس لايت؟<button data-href="#What-is-Milvus-Lite" class="anchor-icon" translate="no">
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
    </button></h2><p>كما ذكرنا سابقًا، <a href="https://github.com/milvus-io/milvus-lite">ميلفوس لايت</a> هو بديل مبسط لـ Milvus الذي يقدم العديد من المزايا والفوائد.</p>
<ul>
<li>يمكنك دمجه في تطبيق Python الخاص بك دون إضافة وزن إضافي.</li>
<li>إنه مستقل بذاته ولا يتطلب أي تبعيات أخرى، وذلك بفضل قدرة ميلفوس المستقلة على العمل مع Etcd المدمج والتخزين المحلي.</li>
<li>يمكنك استيرادها كمكتبة بايثون واستخدامها كخادم مستقل قائم على واجهة سطر الأوامر (CLI).</li>
<li>يعمل بسلاسة مع Google Colab و Jupyter Notebook.</li>
<li>يمكنك ترحيل عملك وكتابة التعليمات البرمجية بأمان إلى مثيلات Milvus الأخرى (الإصدارات المستقلة والمجمعة والمدارة بالكامل) دون أي خطر فقدان البيانات.</li>
</ul>
<h2 id="When-should-you-use-Milvus-Lite" class="common-anchor-header">متى يجب عليك استخدام Milvus Lite؟<button data-href="#When-should-you-use-Milvus-Lite" class="anchor-icon" translate="no">
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
    </button></h2><p>على وجه التحديد، يكون Milvus Lite مفيدًا للغاية في الحالات التالية:</p>
<ul>
<li>عندما تفضل استخدام Milvus بدون تقنيات وأدوات الحاويات مثل <a href="https://milvus.io/docs/install_standalone-operator.md">Milvus Operator</a> أو <a href="https://milvus.io/docs/install_standalone-helm.md">Helm</a> أو <a href="https://milvus.io/docs/install_standalone-docker.md">Docker Compose</a>.</li>
<li>عندما لا تحتاج إلى أجهزة افتراضية أو حاويات افتراضية لاستخدام Milvus.</li>
<li>عندما تريد دمج ميزات Milvus في تطبيقات Python الخاصة بك.</li>
<li>عندما تريد تشغيل مثيل Milvus في Colab أو Notebook لإجراء تجربة سريعة.</li>
</ul>
<p><strong>ملاحظة</strong>: لا نوصي باستخدام Milvus Lite في أي بيئة إنتاج أو إذا كنت تحتاج إلى أداء عالٍ أو توافر قوي أو قابلية عالية للتوسع. بدلاً من ذلك، فكر في استخدام <a href="https://github.com/milvus-io/milvus">مجموعات Milvus</a> أو <a href="https://zilliz.com/cloud">Milvus المدارة بالكامل على Zilliz Cloud</a> للإنتاج.</p>
<h2 id="How-to-get-started-with-Milvus-Lite" class="common-anchor-header">كيف تبدأ مع ميلفوس لايت؟<button data-href="#How-to-get-started-with-Milvus-Lite" class="anchor-icon" translate="no">
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
    </button></h2><p>الآن، دعنا نلقي نظرة على كيفية تثبيت وتهيئة واستخدام ميلفوس لايت.</p>
<h3 id="Prerequisites" class="common-anchor-header">المتطلبات الأساسية</h3><p>لاستخدام ميلفوس لايت، يرجى التأكد من إكمال المتطلبات التالية:</p>
<ul>
<li>تثبيت Python 3.7 أو إصدار أحدث.</li>
<li>استخدام أحد أنظمة التشغيل التي تم التحقق منها المدرجة أدناه:<ul>
<li>أوبونتو &gt;= 18.04 (x86_64)</li>
<li>سنتوس &gt;= 7.0 (x86_64)</li>
<li>نظام التشغيل MacOS &gt;= 11.0 (Apple Silicon)</li>
</ul></li>
</ul>
<p><strong>ملاحظات</strong>:</p>
<ol>
<li>يستخدم Milvus Lite <code translate="no">manylinux2014</code> كصورة أساسية، مما يجعله متوافقًا مع معظم توزيعات لينكس لمستخدمي لينكس.</li>
<li>من الممكن أيضًا تشغيل Milvus Lite على نظام ويندوز، على الرغم من أنه لم يتم التحقق من ذلك بشكل كامل بعد.</li>
</ol>
<h3 id="Install-Milvus-Lite" class="common-anchor-header">تثبيت ميلفوس لايت</h3><p>يتوفر Milvus Lite على PyPI حتى تتمكن من تثبيته عبر <code translate="no">pip</code>.</p>
<pre><code translate="no">$ python3 -m pip install milvus
<button class="copy-code-btn"></button></code></pre>
<p>يمكنك أيضًا تثبيته باستخدام PyMilvus على النحو التالي:</p>
<pre><code translate="no">$ python3 -m pip install milvus[client]
<button class="copy-code-btn"></button></code></pre>
<h3 id="Use-and-start-Milvus-Lite" class="common-anchor-header">استخدام وبدء تشغيل ميلفوس لايت</h3><p>قم بتنزيل <a href="https://github.com/milvus-io/milvus-lite/tree/main/examples">دفتر الأمثلة</a> من مجلد أمثلة مستودع المشروع الخاص بنا. لديك خياران لاستخدام Milvus Lite: إما استيراده كمكتبة Python أو تشغيله كخادم مستقل على جهازك باستخدام واجهة برمجة التطبيقات CLI.</p>
<ul>
<li>لبدء تشغيل ميلفوس لايت كوحدة بايثون، قم بتنفيذ الأوامر التالية:</li>
</ul>
<pre><code translate="no"><span class="hljs-keyword">from</span> milvus <span class="hljs-keyword">import</span> default_server
<span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> connections, utility

<span class="hljs-comment"># Start your milvus server</span>
default_server.start()

<span class="hljs-comment"># Now you can connect with localhost and the given port</span>
<span class="hljs-comment"># Port is defined by default_server.listen_port</span>
connections.connect(host=<span class="hljs-string">&#x27;127.0.0.1&#x27;</span>, port=default_server.listen_port)

<span class="hljs-comment"># Check if the server is ready.</span>
<span class="hljs-built_in">print</span>(utility.get_server_version())

<span class="hljs-comment"># Stop your milvus server</span>
default_server.stop()
<button class="copy-code-btn"></button></code></pre>
<ul>
<li>لتعليق أو إيقاف Milvus Lite، استخدم البيان <code translate="no">with</code>.</li>
</ul>
<pre><code translate="no"><span class="hljs-keyword">from</span> milvus <span class="hljs-keyword">import</span> default_server

<span class="hljs-keyword">with</span> default_server:
  <span class="hljs-comment"># Milvus Lite has already started, use default_server here.</span>
  connections.connect(host=<span class="hljs-string">&#x27;127.0.0.1&#x27;</span>, port=default_server.listen_port)
<button class="copy-code-btn"></button></code></pre>
<ul>
<li>لبدء تشغيل Milvus Lite كخادم مستقل قائم على CLI، قم بتشغيل الأمر التالي:</li>
</ul>
<pre><code translate="no">milvus-server
<button class="copy-code-btn"></button></code></pre>
<p>بعد أن تبدأ تشغيل Milvus Lite، يمكنك استخدام PyMilvus أو أي أدوات أخرى تفضلها للاتصال بالخادم المستقل.</p>
<h3 id="Start-Milvus-Lite-in-a-debug-mode" class="common-anchor-header">بدء تشغيل Milvus Lite في وضع التصحيح</h3><ul>
<li>لتشغيل Milvus Lite في وضع التصحيح كوحدة Python Module، قم بتنفيذ الأوامر التالية:</li>
</ul>
<pre><code translate="no"><span class="hljs-keyword">from</span> milvus <span class="hljs-keyword">import</span> debug_server, MilvusServer

debug_server.run()

<span class="hljs-comment"># Or you can create a MilvusServer by yourself</span>
<span class="hljs-comment"># server = MilvusServer(debug=True)</span>
<button class="copy-code-btn"></button></code></pre>
<ul>
<li>لتشغيل الخادم المستقل في وضع التصحيح، قم بتنفيذ الأمر التالي:</li>
</ul>
<pre><code translate="no">milvus-server --debug
<button class="copy-code-btn"></button></code></pre>
<h3 id="Persist-data-and-logs" class="common-anchor-header">استمرار البيانات والسجلات</h3><ul>
<li>لإنشاء دليل محلي لميلفوس لايت يحتوي على جميع البيانات والسجلات ذات الصلة، قم بتنفيذ الأوامر التالية:</li>
</ul>
<pre><code translate="no"><span class="hljs-keyword">from</span> milvus <span class="hljs-keyword">import</span> default_server

<span class="hljs-keyword">with</span> <span class="hljs-attr">default_server</span>:
  default_server.<span class="hljs-title function_">set_base_dir</span>(<span class="hljs-string">&#x27;milvus_data&#x27;</span>)
<button class="copy-code-btn"></button></code></pre>
<ul>
<li>لاستبقاء جميع البيانات والسجلات التي تم إنشاؤها بواسطة الخادم المستقل على محرك الأقراص المحلي، قم بتشغيل الأمر التالي:</li>
</ul>
<pre><code translate="no">$ milvus-server --data milvus_data
<button class="copy-code-btn"></button></code></pre>
<h3 id="Configure-Milvus-Lite" class="common-anchor-header">تكوين ميلفوس لايت</h3><p>يشبه تكوين Milvus Lite تكوين Milvus Lite إعداد مثيلات Milvus باستخدام واجهات برمجة تطبيقات Python أو CLI.</p>
<ul>
<li>لتهيئة Milvus Lite باستخدام واجهات برمجة تطبيقات Python، استخدم واجهة برمجة التطبيقات <code translate="no">config.set</code> لمثيل <code translate="no">MilvusServer</code> لكل من الإعدادات الأساسية والإضافية:</li>
</ul>
<pre><code translate="no"><span class="hljs-keyword">from</span> milvus <span class="hljs-keyword">import</span> default_server

<span class="hljs-keyword">with</span> default_server:
  default_server.config.<span class="hljs-built_in">set</span>(<span class="hljs-string">&#x27;system_Log_level&#x27;</span>, <span class="hljs-string">&#x27;info&#x27;</span>)
  default_server.config.<span class="hljs-built_in">set</span>(<span class="hljs-string">&#x27;proxy_port&#x27;</span>, <span class="hljs-number">19531</span>)
  default_server.config.<span class="hljs-built_in">set</span>(<span class="hljs-string">&#x27;dataCoord.segment.maxSize&#x27;</span>, <span class="hljs-number">1024</span>)
<button class="copy-code-btn"></button></code></pre>
<ul>
<li>لتكوين Milvus Lite باستخدام CLI، قم بتشغيل الأمر التالي للإعدادات الأساسية:</li>
</ul>
<pre><code translate="no">$ milvus-server --system-log-level info
$ milvus-server --proxy-port 19531
<button class="copy-code-btn"></button></code></pre>
<ul>
<li>أو قم بتشغيل ما يلي للإعدادات الإضافية.</li>
</ul>
<pre><code translate="no">$ milvus-server --extra-config dataCoord.segment.maxSize=1024
<button class="copy-code-btn"></button></code></pre>
<p>جميع العناصر القابلة للتهيئة موجودة في القالب <code translate="no">config.yaml</code> الذي يتم شحنه مع حزمة ميلفوس.</p>
<p>لمزيد من التفاصيل الفنية حول كيفية تثبيت وتكوين Milvus Lite، راجع <a href="https://milvus.io/docs/milvus_lite.md#Prerequisites">وثائقنا</a>.</p>
<h2 id="Summary" class="common-anchor-header">ملخص<button data-href="#Summary" class="anchor-icon" translate="no">
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
    </button></h2><p>يعد Milvus Lite خيارًا ممتازًا لأولئك الذين يبحثون عن إمكانيات Milvus بتنسيق مضغوط. وسواء كنت باحثًا أو مطورًا أو عالم بيانات، فإن الأمر يستحق استكشاف هذا الخيار.</p>
<p>يُعدّ Milvus Lite أيضًا إضافة جميلة لمجتمع المصادر المفتوحة، حيث يعرض العمل الاستثنائي للمساهمين فيه. وبفضل جهود بن جي، أصبح تطبيق Milvus متاحًا الآن لعدد أكبر من المستخدمين. لا يمكننا الانتظار لرؤية الأفكار المبتكرة التي سيقدمها بن جي وغيره من أعضاء مجتمع Milvus في المستقبل.</p>
<h2 id="Let’s-keep-in-touch" class="common-anchor-header">دعونا نبقى على اتصال!<button data-href="#Let’s-keep-in-touch" class="anchor-icon" translate="no">
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
    </button></h2><p>إذا واجهتك مشاكل في تثبيت أو استخدام Milvus Lite، يمكنك <a href="https://github.com/milvus-io/milvus-lite/issues/new">تقديم مشكلة هنا</a> أو الاتصال بنا عبر <a href="https://twitter.com/milvusio">تويتر</a> أو <a href="https://www.linkedin.com/company/the-milvus-project">لينكد إن</a>. نرحب بك أيضًا للانضمام إلى <a href="https://milvus.io/slack/">قناة Slack</a> الخاصة بنا للدردشة مع مهندسينا والمجتمع بأكمله، أو تحقق من <a href="https://us02web.zoom.us/meeting/register/tZ0pcO6vrzsuEtVAuGTpNdb6lGnsPBzGfQ1T#/registration">ساعات العمل يوم الثلاثاء</a>!</p>
