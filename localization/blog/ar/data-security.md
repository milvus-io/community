---
id: data-security.md
title: كيف تضمن قاعدة بيانات ميلفوس فيكتور أمن البيانات؟
author: Angela Ni
date: 2022-09-05T00:00:00.000Z
desc: تعرف على مصادقة المستخدم والتشفير أثناء النقل في Milvus.
cover: assets.zilliz.com/Security_192e35a790.png
tag: Engineering
tags: 'Vector Database for AI, Artificial Intelligence, Machine Learning'
canonicalUrl: 'https://milvus.io/blog/data-security.md'
---
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Security_192e35a790.png" alt="Cover image" class="doc-image" id="cover-image" />
   </span> <span class="img-wrapper"> <span>صورة الغلاف</span> </span></p>
<p>مراعاةً لأمان بياناتك بشكل كامل، أصبحت مصادقة المستخدم واتصال أمان طبقة النقل (TLS) متاحة الآن رسميًا في Milvus 2.1. بدون مصادقة المستخدم، يمكن لأي شخص الوصول إلى جميع البيانات في قاعدة بيانات المتجهات الخاصة بك باستخدام SDK. ومع ذلك، بدءًا من الإصدار Milvus 2.1، لا يمكن الوصول إلى قاعدة بيانات Milvus vector إلا لمن لديهم اسم مستخدم وكلمة مرور صالحين. بالإضافة إلى ذلك، في Milvus 2.1، يتم حماية أمن البيانات في Milvus 2.1 بشكل أكبر بواسطة TLS، مما يضمن اتصالات آمنة في شبكة الكمبيوتر.</p>
<p>تهدف هذه المقالة إلى تحليل كيفية ضمان قاعدة بيانات المتجهات في ملفوس لأمن البيانات من خلال مصادقة المستخدم واتصال TLS وشرح كيفية الاستفادة من هاتين الميزتين كمستخدم يريد ضمان أمن البيانات عند استخدام قاعدة بيانات المتجهات.</p>
<p><strong>انتقل إلى:</strong></p>
<ul>
<li><a href="#What-is-database-security-and-why-is-it-important">ما هو أمان قاعدة البيانات ولماذا هو مهم؟</a></li>
<li><a href="#How-does-the-Milvus-vector-database-ensure-data-security">كيف تضمن قاعدة بيانات ميلفوس المتجهة أمان البيانات؟</a><ul>
<li><a href="#User-authentication">مصادقة المستخدم</a></li>
<li><a href="#TLS-connection">اتصال TLS</a></li>
</ul></li>
</ul>
<h2 id="What-is-database-security-and-why-is-it-important" class="common-anchor-header">ما هو أمن قاعدة البيانات ولماذا هو مهم؟<button data-href="#What-is-database-security-and-why-is-it-important" class="anchor-icon" translate="no">
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
    </button></h2><p>يشير أمن قاعدة البيانات إلى التدابير المتخذة لضمان أن جميع البيانات في قاعدة البيانات آمنة ومحفوظة السرية. حالات اختراق البيانات وتسريب البيانات التي حدثت مؤخرًا في <a href="https://firewalltimes.com/recent-data-breaches/">تويتر وماريوت وإدارة التأمين في تكساس وغيرها</a> تجعلنا أكثر يقظة لمسألة أمن البيانات. كل هذه الحالات تذكرنا باستمرار بأن الشركات والشركات يمكن أن تعاني من خسائر فادحة إذا لم تكن البيانات محمية بشكل جيد وقواعد البيانات التي تستخدمها آمنة.</p>
<h2 id="How-does-the-Milvus-vector-database-ensure-data-security" class="common-anchor-header">كيف تضمن قاعدة بيانات Milvus vector أمن البيانات؟<button data-href="#How-does-the-Milvus-vector-database-ensure-data-security" class="anchor-icon" translate="no">
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
    </button></h2><p>في الإصدار الحالي من الإصدار 2.1، تحاول قاعدة بيانات Milvus vector ضمان أمن قاعدة البيانات عن طريق المصادقة والتشفير. وبشكل أكثر تحديدًا، على مستوى الوصول، تدعم Milvus مصادقة المستخدم الأساسية للتحكم في من يمكنه الوصول إلى قاعدة البيانات. وفي الوقت نفسه، على مستوى قاعدة البيانات، تعتمد Milvus بروتوكول تشفير طبقة النقل (TLS) لحماية اتصال البيانات.</p>
<h3 id="User-authentication" class="common-anchor-header">مصادقة المستخدم</h3><p>تدعم ميزة مصادقة المستخدم الأساسية في Milvus الوصول إلى قاعدة بيانات المتجهات باستخدام اسم مستخدم وكلمة مرور من أجل أمن البيانات. وهذا يعني أنه لا يمكن للعملاء الوصول إلى مثيل Milvus إلا عند تقديم اسم مستخدم وكلمة مرور مصادق عليهما.</p>
<h4 id="The-authentication-workflow-in-the-Milvus-vector-database" class="common-anchor-header">سير عمل المصادقة في قاعدة بيانات متجهات ميلفوس</h4><p>يتم التعامل مع جميع طلبات gRPC بواسطة وكيل Milvus، وبالتالي تتم المصادقة بواسطة الوكيل. يكون سير عمل تسجيل الدخول باستخدام بيانات الاعتماد للاتصال بمثيل Milvus على النحو التالي.</p>
<ol>
<li>إنشاء بيانات اعتماد لكل مثيل Milvus ويتم تخزين كلمات المرور المشفرة في etcd. تستخدم Milvus <a href="https://golang.org/x/crypto/bcrypt">bcrypt</a> للتشفير حيث تقوم بتنفيذ <a href="http://www.usenix.org/event/usenix99/provos/provos.pdf">خوارزمية التجزئة التكيفية</a> الخاصة بـ Provos و Mazières.</li>
<li>من جانب العميل، ترسل SDK نصًا مشفرًا عند الاتصال بخدمة Milvus. يتم إرفاق نص التشفير الأساسي 64 (<username>:<password>) بالبيانات الوصفية مع المفتاح <code translate="no">authorization</code>.</li>
<li>يعترض وكيل Milvus الطلب ويتحقق من بيانات الاعتماد.</li>
<li>يتم تخزين بيانات الاعتماد مؤقتًا محليًا في الوكيل.</li>
</ol>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1280_X1280_021e90e3c8.jpeg" alt="authetication_workflow" class="doc-image" id="authetication_workflow" />
   </span> <span class="img-wrapper"> <span>سير_عمل_التوثيق التلقائي</span> </span></p>
<p>عندما يتم تحديث بيانات الاعتماد، يكون سير عمل النظام في ميلفوس كما يلي</p>
<ol>
<li>التنسيق الجذر هو المسؤول عن بيانات الاعتماد عند استدعاء واجهات برمجة التطبيقات للإدراج والاستعلام والحذف.</li>
<li>عندما تقوم بتحديث بيانات الاعتماد لأنك نسيت كلمة المرور على سبيل المثال، يتم الاحتفاظ بكلمة المرور الجديدة في إلخد. ثم يتم إبطال جميع بيانات الاعتماد القديمة في ذاكرة التخزين المؤقت المحلية للوكيل.</li>
<li>يبحث معترض المصادقة عن السجلات من ذاكرة التخزين المؤقت المحلية أولاً. إذا كانت بيانات الاعتماد الموجودة في ذاكرة التخزين المؤقت غير صحيحة، فسيتم تشغيل استدعاء RPC لجلب أحدث سجل من جذر التنسيق. ويتم تحديث بيانات الاعتماد في ذاكرة التخزين المؤقت المحلية وفقًا لذلك.</li>
</ol>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/update_5af81a4173.jpeg" alt="credential_update_workflow" class="doc-image" id="credential_update_workflow" />
   </span> <span class="img-wrapper"> <span>سير عمل_تحديث_بيانات_الاعتماد</span> </span></p>
<h4 id="How-to-manage-user-authentication-in-the-Milvus-vector-database" class="common-anchor-header">كيفية إدارة مصادقة المستخدم في قاعدة بيانات Milvus vector</h4><p>لتمكين المصادقة، تحتاج أولاً إلى تعيين <code translate="no">common.security.authorizationEnabled</code> إلى <code translate="no">true</code> عند تكوين ملف Milvus في ملف <code translate="no">milvus.yaml</code>.</p>
<p>بمجرد التمكين، سيتم إنشاء مستخدم جذر لمثيل ميلفوس. يمكن لمستخدم الجذر هذا استخدام كلمة المرور الأولية <code translate="no">Milvus</code> للاتصال بقاعدة بيانات Milvus vector.</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> connections
connections.<span class="hljs-title function_">connect</span>(
    alias=<span class="hljs-string">&#x27;default&#x27;</span>,
    host=<span class="hljs-string">&#x27;localhost&#x27;</span>,
    port=<span class="hljs-string">&#x27;19530&#x27;</span>,
    user=<span class="hljs-string">&#x27;root_user&#x27;</span>,
    password=<span class="hljs-string">&#x27;Milvus&#x27;</span>,
)
<button class="copy-code-btn"></button></code></pre>
<p>نوصي بشدة بتغيير كلمة مرور المستخدم الجذر عند بدء تشغيل ميلفوس للمرة الأولى.</p>
<p>بعد ذلك يمكن للمستخدم الجذر إنشاء المزيد من المستخدمين الجدد للوصول المصادق عليه عن طريق تشغيل الأمر التالي لإنشاء مستخدمين جدد.</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> utility
utility.<span class="hljs-title function_">create_credential</span>(<span class="hljs-string">&#x27;user&#x27;</span>, <span class="hljs-string">&#x27;password&#x27;</span>, <span class="hljs-keyword">using</span>=<span class="hljs-string">&#x27;default&#x27;</span>) 
<button class="copy-code-btn"></button></code></pre>
<p>هناك أمران يجب تذكرهما عند إنشاء مستخدمين جدد:</p>
<ol>
<li><p>بالنسبة لاسم المستخدم الجديد، لا يمكن أن يتجاوز طوله 32 حرفًا ويجب أن يبدأ بحرف. يُسمح فقط بالشرطات السفلية أو الحروف أو الأرقام في اسم المستخدم. على سبيل المثال اسم المستخدم "2abc!" غير مقبول.</p></li>
<li><p>بالنسبة لكلمة المرور، يجب أن يكون طولها 6-256 حرفًا.</p></li>
</ol>
<p>بمجرد إعداد بيانات الاعتماد الجديدة، يمكن للمستخدم الجديد الاتصال بمثيل ميلفوس باستخدام اسم المستخدم وكلمة المرور.</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> connections
connections.<span class="hljs-title function_">connect</span>(
    alias=<span class="hljs-string">&#x27;default&#x27;</span>,
    host=<span class="hljs-string">&#x27;localhost&#x27;</span>,
    port=<span class="hljs-string">&#x27;19530&#x27;</span>,
    user=<span class="hljs-string">&#x27;user&#x27;</span>,
    password=<span class="hljs-string">&#x27;password&#x27;</span>,
)
<button class="copy-code-btn"></button></code></pre>
<p>مثل جميع عمليات المصادقة، لا داعي للقلق إذا نسيت كلمة المرور. يمكن إعادة تعيين كلمة المرور لمستخدم موجود باستخدام الأمر التالي.</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> utility
utility.<span class="hljs-title function_">reset_password</span>(<span class="hljs-string">&#x27;user&#x27;</span>, <span class="hljs-string">&#x27;new_password&#x27;</span>, <span class="hljs-keyword">using</span>=<span class="hljs-string">&#x27;default&#x27;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>اقرأ <a href="https://milvus.io/docs/v2.1.x/authenticate.md">وثائق Milvus</a> لمعرفة المزيد عن مصادقة المستخدم.</p>
<h3 id="TLS-connection" class="common-anchor-header">اتصال TLS</h3><p>أمان طبقة النقل (TLS) هو نوع من بروتوكول المصادقة لتوفير أمان الاتصالات في شبكة الكمبيوتر. يستخدم TLS شهادات لتوفير خدمات المصادقة بين طرفين أو أكثر من أطراف الاتصال.</p>
<h4 id="How-to-enable-TLS-in-the-Milvus-vector-database" class="common-anchor-header">كيفية تمكين TLS في قاعدة بيانات Milvus vector</h4><p>لتمكين TLS في Milvus، تحتاج أولاً إلى تشغيل الأمر التالي لإعداد ملفين لإنشاء الشهادة: ملف تكوين OpenSSL افتراضي باسم <code translate="no">openssl.cnf</code> وملف باسم <code translate="no">gen.sh</code> يستخدم لإنشاء الشهادات ذات الصلة.</p>
<pre><code translate="no"><span class="hljs-built_in">mkdir</span> cert &amp;&amp; <span class="hljs-built_in">cd</span> cert
<span class="hljs-built_in">touch</span> openssl.cnf gen.sh
<button class="copy-code-btn"></button></code></pre>
<p>ثم يمكنك ببساطة نسخ ولصق التكوين الذي نقدمه <a href="https://milvus.io/docs/v2.1.x/tls.md#Create-files">هنا</a> في الملفين. أو يمكنك أيضًا إجراء تعديلات بناءً على تكويننا لتناسب تطبيقك بشكل أفضل.</p>
<p>عندما يصبح الملفان جاهزين، يمكنك تشغيل الملف <code translate="no">gen.sh</code> لإنشاء تسعة ملفات شهادات. وبالمثل، يمكنك أيضًا تعديل التكوينات في ملفات الشهادات التسعة لتناسب حاجتك.</p>
<pre><code translate="no"><span class="hljs-built_in">chmod</span> +x gen.sh
./gen.sh
<button class="copy-code-btn"></button></code></pre>
<p>هناك خطوة أخيرة قبل أن تتمكن من الاتصال بخدمة Milvus باستخدام TLS. يجب عليك تعيين <code translate="no">tlsEnabled</code> إلى <code translate="no">true</code> وتكوين مسارات الملفات <code translate="no">server.pem</code> و <code translate="no">server.key</code> و <code translate="no">ca.pem</code> للخادم في <code translate="no">config/milvus.yaml</code>. الرمز أدناه هو مثال على ذلك.</p>
<pre><code translate="no">tls:
  serverPemPath: configs/cert/server.pem
  serverKeyPath: configs/cert/server.key
  caPemPath: configs/cert/ca.pem

common:
  security:
    tlsEnabled: <span class="hljs-literal">true</span>
<button class="copy-code-btn"></button></code></pre>
<p>بعد ذلك تكون جاهزًا تمامًا ويمكنك الاتصال بخدمة Milvus باستخدام TLS طالما أنك تحدد مسارات الملفات <code translate="no">client.pem</code> و <code translate="no">client.key</code> و <code translate="no">ca.pem</code> للعميل عند استخدام مجموعة أدوات تطوير البرمجيات الخاصة باتصال Milvus. الرمز أدناه هو أيضًا مثال على ذلك.</p>
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
<li><a href="https://milvus.io/blog/2022-08-08-How-to-use-string-data-to-empower-your-similarity-search-applications.md">كيفية استخدام بيانات السلاسل لتمكين تطبيقات البحث عن التشابه لديك</a></li>
<li><a href="https://milvus.io/blog/embedded-milvus.md">استخدام ميلفوس المدمج لتثبيت وتشغيل ميلفوس مع بايثون على الفور</a></li>
<li><a href="https://milvus.io/blog/in-memory-replicas.md">زيادة إنتاجية قراءة قاعدة بيانات المتجهات باستخدام النسخ المتماثلة في الذاكرة</a></li>
<li><a href="https://milvus.io/blog/understanding-consistency-levels-in-the-milvus-vector-database.md">فهم مستوى الاتساق في قاعدة بيانات Milvus Vector في قاعدة بيانات Milvus</a></li>
<li><a href="https://milvus.io/blog/understanding-consistency-levels-in-the-milvus-vector-database-2.md">فهم مستوى الاتساق في قاعدة بيانات Milvus Vector (الجزء الثاني)</a></li>
<li><a href="https://milvus.io/blog/data-security.md">كيف تضمن قاعدة بيانات Milvus Vector أمان البيانات؟</a></li>
</ul>
