---
id: 2021-12-31-get-started-with-milvus-cli.md
title: ابدأ باستخدام Milvus_CLI
author: Zhuanghong Chen and Zhen Chen
date: 2021-12-31T00:00:00.000Z
desc: تقدم هذه المقالة Milvus_CLI وتساعدك على إكمال المهام الشائعة.
cover: assets.zilliz.com/CLI_9a10de4fcc.png
tag: Engineering
recommend: true
canonicalUrl: 'https://zilliz.com/blog/get-started-with-milvus-cli'
---
<p>في عصر الانفجار المعلوماتي، أصبحنا ننتج الصوت والصور ومقاطع الفيديو وغيرها من البيانات غير المنظمة طوال الوقت. كيف يمكننا تحليل هذا الكم الهائل من البيانات بكفاءة؟ يتيح ظهور الشبكات العصبية إمكانية تضمين البيانات غير المهيكلة في صورة متجهات، وقاعدة بيانات Milvus هي برنامج أساسي لخدمة البيانات، يساعد على إكمال تخزين البيانات المتجهة والبحث عنها وتحليلها.</p>
<p>ولكن كيف يمكننا استخدام قاعدة بيانات المتجهات Milvus بسرعة؟</p>
<p>اشتكى بعض المستخدمين من صعوبة حفظ واجهات برمجة التطبيقات، ويأملون في وجود سطور أوامر بسيطة لتشغيل قاعدة بيانات Milvus.</p>
<p>يسرنا أن نقدم لكم Milvus_CLI، وهي أداة سطر أوامر مخصصة لقاعدة بيانات Milvus vector.</p>
<p>Milvus_CLI عبارة عن واجهة برمجية مريحة لقاعدة بيانات Milvus، تدعم الاتصال بقاعدة البيانات واستيراد البيانات وتصدير البيانات وحساب المتجهات باستخدام الأوامر التفاعلية في الأصداف. يحتوي أحدث إصدار من Milvus_CLI على الميزات التالية.</p>
<ul>
<li><p>دعم جميع الأنظمة الأساسية، بما في ذلك ويندوز وماك ولينكس</p></li>
<li><p>يدعم التثبيت عبر الإنترنت وغير متصل بالإنترنت مع دعم النقطة</p></li>
<li><p>محمول، يمكن استخدامه في أي مكان</p></li>
<li><p>مبني على Milvus SDK ل Python</p></li>
<li><p>مستندات المساعدة مضمنة</p></li>
<li><p>الإكمال التلقائي مدعوم</p></li>
</ul>
<h2 id="Installation" class="common-anchor-header">التثبيت<button data-href="#Installation" class="anchor-icon" translate="no">
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
    </button></h2><p>يمكنك تثبيت Milvus_CLI إما عبر الإنترنت أو دون اتصال بالإنترنت.</p>
<h3 id="Install-MilvusCLI-online" class="common-anchor-header">تثبيت Milvus_CLI عبر الإنترنت</h3><p>قم بتشغيل الأمر التالي لتثبيت Milvus_CLI عبر الإنترنت باستخدام pip. مطلوب Python 3.8 أو أحدث.</p>
<pre><code translate="no">pip install milvus-cli
<button class="copy-code-btn"></button></code></pre>
<h3 id="Install-MilvusCLI-offline" class="common-anchor-header">تثبيت Milvus_CLI دون اتصال بالإنترنت</h3><p>لتثبيت ملف Milvus_CLI دون اتصال بالإنترنت، قم <a href="https://github.com/milvus-io/milvus_cli/releases">بتنزيل</a> أحدث نسخة من صفحة الإصدار أولاً.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1_af0e832119.png" alt="1.png" class="doc-image" id="1.png" />
   </span> <span class="img-wrapper"> <span>1.png</span> </span></p>
<p>بعد تنزيل كرة القطران، قم بتشغيل الأمر التالي لتثبيت Milvus_CLI.</p>
<pre><code translate="no">pip install milvus_cli-&lt;version&gt;.tar.gz
<button class="copy-code-btn"></button></code></pre>
<p>بعد تثبيت Milvus_CLI، قم بتشغيل <code translate="no">milvus_cli</code>. يشير موجه <code translate="no">milvus_cli &gt;</code> الذي يظهر إلى أن سطر الأوامر جاهز.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/2_b50f5d2a5a.png" alt="2.png" class="doc-image" id="2.png" />
   </span> <span class="img-wrapper"> <span>2.png</span> </span></p>
<p>إذا كنت تستخدم جهاز Mac مع شريحة M1 أو جهاز كمبيوتر بدون بيئة Python، يمكنك اختيار استخدام تطبيق محمول بدلاً من ذلك. ولتحقيق ذلك، قم <a href="https://github.com/milvus-io/milvus_cli/releases">بتنزيل</a> ملف على صفحة الإصدار المطابق لنظام التشغيل الخاص بك، وقم بتشغيل <code translate="no">chmod +x</code> على الملف لجعله قابلاً للتنفيذ، ثم قم بتشغيل <code translate="no">./</code> على الملف لتشغيله.</p>
<h4 id="Example" class="common-anchor-header"><strong>مثال</strong></h4><p>المثال التالي يجعل الملف <code translate="no">milvus_cli-v0.1.8-fix2-macOS</code> قابلاً للتنفيذ ويقوم بتشغيله.</p>
<pre><code translate="no"><span class="hljs-built_in">sudo</span> <span class="hljs-built_in">chmod</span> +x milvus_cli-v0.1.8-fix2-macOS
./milvus_cli-v0.1.8-fix2-macOS
<button class="copy-code-btn"></button></code></pre>
<h2 id="Usage" class="common-anchor-header">الاستخدام<button data-href="#Usage" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Connect-to-Milvus" class="common-anchor-header">الاتصال بميلفوس</h3><p>قبل الاتصال بـ Milvus، تأكد من تثبيت Milvus على الخادم الخاص بك. راجع <a href="https://milvus.io/docs/v2.0.x/install_standalone-docker.md">تثبيت Milvus Standalone</a> أو <a href="https://milvus.io/docs/v2.0.x/install_cluster-docker.md">تثبيت Milvus Cluster</a> لمزيد من المعلومات.</p>
<p>إذا تم تثبيت Milvus على المضيف المحلي الخاص بك مع المنفذ الافتراضي، قم بتشغيل <code translate="no">connect</code>.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/3_f950d3739a.png" alt="3.png" class="doc-image" id="3.png" />
   </span> <span class="img-wrapper"> <span>3.png</span> </span></p>
<p>خلاف ذلك، قم بتشغيل الأمر التالي باستخدام عنوان IP لخادم Milvus الخاص بك. يستخدم المثال التالي <code translate="no">172.16.20.3</code> كعنوان IP و <code translate="no">19530</code> كرقم المنفذ.</p>
<pre><code translate="no">connect -h 172.16.20.3
<button class="copy-code-btn"></button></code></pre>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/4_9ff2db9855.png" alt="4.png" class="doc-image" id="4.png" />
   </span> <span class="img-wrapper"> <span>4.png</span> </span></p>
<h3 id="Create-a-collection" class="common-anchor-header">إنشاء مجموعة</h3><p>يقدم هذا القسم كيفية إنشاء مجموعة.</p>
<p>تتكون المجموعة من كيانات وتشبه الجدول في RDBMS. راجع <a href="https://milvus.io/docs/v2.0.x/glossary.md">المسرد</a> لمزيد من المعلومات.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/5_95a88c1cbf.png" alt="5.png" class="doc-image" id="5.png" />
   </span> <span class="img-wrapper"> <span>5.png</span> </span></p>
<h4 id="Example" class="common-anchor-header">مثال</h4><p>يقوم المثال التالي بإنشاء مجموعة باسم <code translate="no">car</code>. تحتوي المجموعة <code translate="no">car</code> على أربعة حقول هي: <code translate="no">id</code> و <code translate="no">vector</code> و <code translate="no">color</code> و <code translate="no">brand</code>. حقل المفتاح الأساسي هو <code translate="no">id</code>. راجع <a href="https://milvus.io/docs/v2.0.x/cli_commands.md#create-collection">إنشاء مجموعة</a> لمزيد من المعلومات.</p>
<pre><code translate="no">create collection -c car -f <span class="hljs-built_in">id</span>:INT64:primary_field -f vector:FLOAT_VECTOR:<span class="hljs-number">128</span> -f color:INT64:color -f brand:INT64:brand -p <span class="hljs-built_in">id</span> -a -d <span class="hljs-string">&#x27;car_collection&#x27;</span>
<button class="copy-code-btn"></button></code></pre>
<h3 id="List-collections" class="common-anchor-header">سرد المجموعات</h3><p>قم بتشغيل الأمر التالي لسرد كافة المجموعات في مثيل Milvus هذا.</p>
<pre><code translate="no">list collections
<button class="copy-code-btn"></button></code></pre>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/6_1331f4c8bc.png" alt="6.png" class="doc-image" id="6.png" />
   </span> <span class="img-wrapper"> <span>6.png</span> </span></p>
<p>قم بتشغيل الأمر التالي للتحقق من تفاصيل المجموعة <code translate="no">car</code>.</p>
<pre><code translate="no">describe collection -c car 
<button class="copy-code-btn"></button></code></pre>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/7_1d70beee54.png" alt="7.png" class="doc-image" id="7.png" />
   </span> <span class="img-wrapper"> <span>7.png</span> </span></p>
<h3 id="Calculate-the-distance-between-two-vectors" class="common-anchor-header">احسب المسافة بين متجهين</h3><p>قم بتشغيل الأمر التالي لاستيراد البيانات إلى المجموعة <code translate="no">car</code>.</p>
<pre><code translate="no"><span class="hljs-keyword">import</span> -c car <span class="hljs-string">&#x27;https://raw.githubusercontent.com/zilliztech/milvus_cli/main/examples/import_csv/vectors.csv&#x27;</span>
<button class="copy-code-btn"></button></code></pre>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/8_7609a4359a.png" alt="8.png" class="doc-image" id="8.png" />
   </span> <span class="img-wrapper"> <span>8.png</span> </span></p>
<p>قم بتشغيل <code translate="no">query</code> وأدخل <code translate="no">car</code> كاسم المجموعة و <code translate="no">id&gt;0</code> كتعبير الاستعلام عندما يُطلب منك ذلك. يتم إرجاع معرفات الكيانات التي تستوفي المعايير كما هو موضح في الشكل التالي.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/9_f0755589f6.png" alt="9.png" class="doc-image" id="9.png" />
   </span> <span class="img-wrapper"> <span>9.png</span> </span></p>
<p>قم بتشغيل <code translate="no">calc</code> وأدخل القيم المناسبة عند المطالبة بحساب المسافات بين مصفوفات المتجهات.</p>
<h3 id="Delete-a-collection" class="common-anchor-header">حذف مجموعة</h3><p>قم بتشغيل الأمر التالي لحذف المجموعة <code translate="no">car</code>.</p>
<pre><code translate="no"><span class="hljs-keyword">delete</span> collection -c car
<button class="copy-code-btn"></button></code></pre>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/10_16b2b01935.png" alt="10.png" class="doc-image" id="10.png" />
   </span> <span class="img-wrapper"> <span>10.png</span> </span></p>
<h2 id="More" class="common-anchor-header">المزيد<button data-href="#More" class="anchor-icon" translate="no">
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
    </button></h2><p>لا يقتصر Milvus_CLI على الوظائف السابقة. قم بتشغيل <code translate="no">help</code> لعرض جميع الأوامر التي يتضمنها Milvus_CLI والأوصاف الخاصة بها. قم بتشغيل <code translate="no">&lt;command&gt; --help</code> لعرض تفاصيل أمر محدد.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/11_5f31ccb1e8.png" alt="11.png" class="doc-image" id="11.png" />
   </span> <span class="img-wrapper"> <span>11.png</span> </span></p>
<p><strong>انظر أيضاً:</strong></p>
<p><a href="https://milvus.io/docs/v2.0.x/cli_commands.md">مرجع أوامر Milvus_CLI</a> ضمن مستندات Milvus Docs</p>
<p>نأمل أن تساعدك Milvus_CLI في استخدام قاعدة بيانات Milvus vector بسهولة. سنواصل تحسين Milvus_CLI ونرحب بمساهماتك.</p>
<p>إذا كانت لديك أي أسئلة، فلا تتردد في <a href="https://github.com/zilliztech/milvus_cli/issues">تقديم مشكلة</a> على GitHub.</p>
