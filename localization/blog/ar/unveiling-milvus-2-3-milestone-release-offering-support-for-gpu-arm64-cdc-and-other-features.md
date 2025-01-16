---
id: >-
  unveiling-milvus-2-3-milestone-release-offering-support-for-gpu-arm64-cdc-and-other-features.md
title: >-
  كشف النقاب عن الإصدار Milvus 2.3: إصدار بارز يقدم دعمًا لوحدة معالجة الرسومات
  وArm64 وCDC والعديد من الميزات الأخرى المنتظرة
author: 'Owen Jiao, Fendy Feng'
date: 2023-08-28T00:00:00.000Z
desc: >-
  يُعدّ الإصدار Milvus 2.3 إصدارًا بارزًا مع العديد من الميزات المنتظرة بشدة،
  بما في ذلك دعم وحدة معالجة الرسومات وArm64 وApsert وعمليات الإدراج والتقاط
  بيانات التغيير وفهرس ScaNN والبحث عن النطاق. كما أنه يقدم أداءً محسّنًا
  للاستعلام، وموازنة تحميل وجدولة أكثر قوة، وإمكانية مراقبة وتشغيل أفضل.
cover: assets.zilliz.com/Milvus_2_3_Milvus_io_2e3b0eb55c.jpeg
tag: News
tags: >-
  Vector Database, AI, Artificial Intelligence, Machine Learning, Milvus, LLM,
  Large Language Models, Embeddings, Vector search, Vector similarity search
recommend: true
canonicalUrl: >-
  https://milvus.io/blog/unveiling-milvus-2-3-milestone-release-offering-support-for-gpu-arm64-cdc-and-other-features.md
---
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Milvus_2_3_Milvus_io_2e3b0eb55c.jpeg" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>أخبار مثيرة! بعد ثمانية أشهر من الجهود المتضافرة، يسعدنا أن نعلن عن إصدار الإصدار Milvus 2.3، وهو إصدار بارز يجلب العديد من الميزات المنتظرة بشدة، بما في ذلك دعم وحدة معالجة الرسومات وArm64 وعمليات الإدراج والتقاط بيانات التغيير وفهرس ScaNN وتقنية MMap. يقدم Milvus 2.3 أيضًا أداءً محسّنًا للاستعلام، وموازنة تحميل وجدولة أكثر قوة، وإمكانية مراقبة وتشغيل أفضل.</p>
<p>انضموا إليّ لإلقاء نظرة على هذه الميزات والتحسينات الجديدة ومعرفة كيف يمكنكم الاستفادة من هذا الإصدار.</p>
<h2 id="Support-for-GPU-index-that-leads-to-3-10-times-faster-in-QPS" class="common-anchor-header">دعم فهرس GPU الذي يؤدي إلى 3-10 مرات أسرع في QPS<button data-href="#Support-for-GPU-index-that-leads-to-3-10-times-faster-in-QPS" class="anchor-icon" translate="no">
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
    </button></h2><p>يعد فهرس GPU ميزة منتظرة بشدة في مجتمع Milvus. بفضل التعاون الرائع مع مهندسي Nvidia، دعم Milvus 2.3 فهرسة وحدة معالجة الرسومات مع خوارزمية RAFT القوية التي تمت إضافتها إلى Knowhere، محرك فهرسة Milvus. مع دعم وحدة معالجة الرسوميات، أصبح Milvus 2.3 أسرع بأكثر من ثلاثة أضعاف في QPS من الإصدارات القديمة التي تستخدم فهرس HNSW لوحدة المعالجة المركزية وأسرع بعشر مرات تقريبًا لمجموعات بيانات محددة تتطلب عمليات حسابية ثقيلة.</p>
<h2 id="Arm64-support-to-accommodate-growing-user-demand" class="common-anchor-header">دعم Arm64 لاستيعاب طلب المستخدمين المتزايد<button data-href="#Arm64-support-to-accommodate-growing-user-demand" class="anchor-icon" translate="no">
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
    </button></h2><p>أصبحت وحدات المعالجة المركزية Arm تحظى بشعبية متزايدة بين مزوّدي الخدمات السحابية والمطوّرين. لتلبية هذا الطلب المتزايد، توفر Milvus الآن صور Docker لبنية ARM64. مع هذا الدعم الجديد لوحدة المعالجة المركزية، يمكن لمستخدمي MacOS بناء تطبيقاتهم مع Milvus بسلاسة أكبر.</p>
<h2 id="Upsert-support-for-better-user-experience" class="common-anchor-header">دعم Upsert لتجربة مستخدم أفضل<button data-href="#Upsert-support-for-better-user-experience" class="anchor-icon" translate="no">
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
    </button></h2><p>يقدم الإصدار Milvus 2.3 تحسينًا ملحوظًا من خلال دعم عملية Upsert. تسمح هذه الوظيفة الجديدة للمستخدمين بتحديث البيانات أو إدراجها بسلاسة وتمكنهم من إجراء كلتا العمليتين في طلب واحد من خلال واجهة Upsert. تعمل هذه الميزة على تبسيط إدارة البيانات وتحقيق الكفاءة.</p>
<p><strong>ملاحظة</strong>:</p>
<ul>
<li>لا تنطبق ميزة Upsert على معرّفات الزيادة التلقائية.</li>
<li>يتم تنفيذ ميزة Upsert كمزيج من <code translate="no">delete</code> و <code translate="no">insert</code> ، مما قد يؤدي إلى بعض الخسارة في الأداء. نوصي باستخدام <code translate="no">insert</code> إذا كنت تستخدم Milvus في سيناريوهات الكتابة الثقيلة.</li>
</ul>
<h2 id="Range-search-for-more-accurate-results" class="common-anchor-header">البحث عن النطاق للحصول على نتائج أكثر دقة<button data-href="#Range-search-for-more-accurate-results" class="anchor-icon" translate="no">
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
    </button></h2><p>يسمح Milvus 2.3 للمستخدمين بتحديد المسافة بين متجه الإدخال والمتجهات المخزنة في Milvus أثناء الاستعلام. ثم يقوم ميلفوس بإرجاع جميع النتائج المطابقة ضمن النطاق المحدد. فيما يلي مثال على تحديد مسافة البحث باستخدام ميزة البحث في النطاق.</p>
<pre><code translate="no"><span class="hljs-comment">// add radius and range_filter to params in search_params</span>
search_params = {<span class="hljs-string">&quot;params&quot;</span>: {<span class="hljs-string">&quot;nprobe&quot;</span>: <span class="hljs-number">10</span>, <span class="hljs-string">&quot;radius&quot;</span>: <span class="hljs-number">10</span>, <span class="hljs-string">&quot;range_filter&quot;</span> : <span class="hljs-number">20</span>}, <span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;L2&quot;</span>}
res = collection.<span class="hljs-title function_">search</span>(
vectors, <span class="hljs-string">&quot;float_vector&quot;</span>, search_params, topK,
<span class="hljs-string">&quot;int64 &gt; 100&quot;</span>, output_fields=[<span class="hljs-string">&quot;int64&quot;</span>, <span class="hljs-string">&quot;float&quot;</span>]
)
<button class="copy-code-btn"></button></code></pre>
<p>في هذا المثال، يطلب المستخدم من Milvus إرجاع متجهات ضمن مسافة 10 إلى 20 وحدة من متجه الإدخال.</p>
<p><strong>ملاحظة</strong>: تختلف مقاييس المسافات المختلفة في كيفية حساب المسافات، مما ينتج عنه نطاقات قيم واستراتيجيات فرز مختلفة. لذلك، من الضروري فهم خصائصها قبل استخدام ميزة البحث في النطاق.</p>
<h2 id="ScaNN-index-for-faster-query-speed" class="common-anchor-header">فهرس ScaNN لسرعة استعلام أسرع<button data-href="#ScaNN-index-for-faster-query-speed" class="anchor-icon" translate="no">
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
    </button></h2><p>يدعم Milvus 2.3 الآن فهرس ScaNN، وهو فهرس <a href="https://zilliz.com/glossary/anns">تقريبي</a> مفتوح المصدر <a href="https://zilliz.com/glossary/anns">لأقرب جار (ANN)</a> تم تطويره بواسطة Google. وقد أظهر فهرس ScaNN أداءً فائقًا في العديد من المعايير، متفوقًا على مؤشر HNSW بحوالي 20% وأسرع من IVFFlat بسبع مرات تقريبًا. مع دعم فهرس ScaNN، يحقق Milvus سرعة استعلام أسرع بكثير مقارنةً بالإصدارات القديمة.</p>
<h2 id="Growing-index-for-stable-and-better-query-performance" class="common-anchor-header">فهرس متزايد لأداء استعلام مستقر وأفضل<button data-href="#Growing-index-for-stable-and-better-query-performance" class="anchor-icon" translate="no">
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
    </button></h2><p>يتضمن Milvus فئتين من البيانات: البيانات المفهرسة والبيانات المتدفقة. يمكن أن يستخدم Milvus الفهارس للبحث في البيانات المفهرسة بسرعة ولكن يمكنه فقط البحث الغاشم في البيانات المتدفقة صفًا بصف، مما قد يؤثر على الأداء. يقدم الإصدار Milvus 2.3 الفهرس المتزايد، والذي يقوم تلقائيًا بإنشاء فهارس في الوقت الفعلي للبيانات المتدفقة لتحسين أداء الاستعلام.</p>
<h2 id="Iterator-for-data-retrieval-in-batches" class="common-anchor-header">مكرر لاسترجاع البيانات على دفعات<button data-href="#Iterator-for-data-retrieval-in-batches" class="anchor-icon" translate="no">
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
    </button></h2><p>في الإصدار Milvus 2.3، قدمت Pymilvus واجهة مكرر تسمح للمستخدمين باسترداد أكثر من 16,384 كيانًا في بحث أو بحث في نطاق. هذه الميزة مفيدة عندما يحتاج المستخدمون إلى تصدير عشرات الآلاف أو حتى أكثر من المتجهات على دفعات.</p>
<h2 id="Support-for-MMap-for-increased-capacity" class="common-anchor-header">دعم MMap لزيادة السعة<button data-href="#Support-for-MMap-for-increased-capacity" class="anchor-icon" translate="no">
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
    </button></h2><p>MMap هو استدعاء نظام UNIX يستخدم لتعيين الملفات والكائنات الأخرى في الذاكرة. يدعم الإصدار Milvus 2.3 من برنامج Milvus 2.3 خاصية MMap، والتي تمكّن المستخدمين من تحميل البيانات على الأقراص المحلية وتعيينها إلى الذاكرة، وبالتالي زيادة سعة الجهاز الواحد.</p>
<p>تشير نتائج الاختبارات التي أجريناها إلى أنه باستخدام تقنية MMap، يمكن لـ Milvus مضاعفة سعة البيانات مع الحد من تدهور الأداء في حدود 20%. يقلل هذا النهج بشكل كبير من التكاليف الإجمالية، مما يجعله مفيدًا بشكل خاص للمستخدمين ذوي الميزانية المحدودة الذين لا يمانعون في المساومة على الأداء.</p>
<h2 id="CDC-support-for-higher-system-availability" class="common-anchor-header">دعم CDC لزيادة توافر النظام<button data-href="#CDC-support-for-higher-system-availability" class="anchor-icon" translate="no">
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
    </button></h2><p>يُعدّ التقاط بيانات التغيير (CDC) ميزة شائعة الاستخدام في أنظمة قواعد البيانات التي تلتقط تغييرات البيانات وتنسخها إلى وجهة محددة. وبفضل ميزة CDC، يُمكّن Milvus 2.3 المستخدمين من مزامنة البيانات عبر مراكز البيانات، والنسخ الاحتياطي للبيانات الإضافية، وترحيل البيانات بسلاسة، مما يجعل النظام أكثر إتاحة.</p>
<p>بالإضافة إلى الميزات المذكورة أعلاه، يقدم الإصدار Milvus 2.3 واجهة عدّ لحساب عدد صفوف البيانات المخزنة في مجموعة بدقة في الوقت الفعلي، ويدعم مقياس جيب التمام لقياس المسافة المتجهة، والمزيد من العمليات على مصفوفات JSON. لمزيد من الميزات والمعلومات التفصيلية، راجع <a href="https://milvus.io/docs/release_notes.md">ملاحظات الإصدار Milvus 2.3</a>.</p>
<h2 id="Enhancements-and-bug-fixes" class="common-anchor-header">التحسينات وإصلاح الأخطاء<button data-href="#Enhancements-and-bug-fixes" class="anchor-icon" translate="no">
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
    </button></h2><p>بالإضافة إلى الميزات الجديدة، يتضمن الإصدار Milvus 2.3 العديد من التحسينات وإصلاحات الأخطاء للإصدارات القديمة.</p>
<h3 id="Improved-performance-for-data-filtering" class="common-anchor-header">تحسين أداء تصفية البيانات</h3><p>يقوم Milvus بإجراء التصفية القياسية قبل البحث عن المتجهات في استعلامات البيانات القياسية والمتجهة المختلطة لتحقيق نتائج أكثر دقة. ومع ذلك، قد ينخفض أداء الفهرسة إذا قام المستخدم بتصفية الكثير من البيانات بعد التصفية القياسية. في الإصدار Milvus 2.3، قمنا في Milvus 2.3 بتحسين استراتيجية التصفية في HNSW لمعالجة هذه المشكلة، مما أدى إلى تحسين أداء الاستعلام.</p>
<h3 id="Increased-multi-core-CPU-usage" class="common-anchor-header">زيادة استخدام وحدة المعالجة المركزية متعددة النواة</h3><p>البحث التقريبي الأقرب التقريبي (ANN) هو مهمة حسابية مكثفة تتطلب موارد هائلة من وحدة المعالجة المركزية. في الإصدارات السابقة، كان بإمكان Milvus استخدام حوالي 70% فقط من موارد وحدة المعالجة المركزية متعددة النواة المتاحة. ومع ذلك، مع الإصدار الأخير، تغلبت Milvus على هذا القيد ويمكنها الاستفادة الكاملة من جميع موارد وحدة المعالجة المركزية متعددة النواة المتاحة، مما أدى إلى تحسين أداء الاستعلام وتقليل هدر الموارد.</p>
<h3 id="Refactored-QueryNode" class="common-anchor-header">عقدة الاستعلام المعاد صياغتها</h3><p>يعد QueryNode مكونًا مهمًا في Milvus وهو مسؤول عن البحث المتجه. ومع ذلك، في الإصدارات القديمة، كان لدى QueryNode حالات معقدة، وقوائم انتظار رسائل مكررة، وبنية كود غير منظمة، ورسائل خطأ غير بديهية.</p>
<p>في الإصدار Milvus 2.3، قمنا بترقية QueryNode من خلال تقديم بنية شيفرة عديمة الحالة وإزالة قائمة انتظار الرسائل لحذف البيانات. ينتج عن هذه التحديثات إهدار أقل للموارد وبحث أسرع وأكثر استقرارًا في المتجهات.</p>
<h3 id="Enhanced-message-queues-based-on-NATS" class="common-anchor-header">قوائم انتظار الرسائل المحسّنة القائمة على NATS</h3><p>لقد قمنا ببناء ميلفوس على بنية قائمة على السجل، وفي الإصدارات السابقة، استخدمنا في الإصدارات السابقة برنامجي بولسار وكافكا كوسيطين أساسيين للسجل. ومع ذلك، واجه هذا المزيج ثلاثة تحديات رئيسية:</p>
<ul>
<li>كان غير مستقر في حالات تعدد المواضيع.</li>
<li>كانت تستهلك الموارد عند الخمول وتواجه صعوبة في إلغاء تكرار الرسائل.</li>
<li>يرتبط بولسار وكافكا ارتباطًا وثيقًا بنظام جافا البيئي، لذلك نادرًا ما يقوم مجتمعهما بصيانة وتحديث حزم SDK الخاصة بهما.</li>
</ul>
<p>ولمعالجة هذه المشاكل، قمنا بدمج NATS و Bookeeper كوسيط سجلات جديد لـ Milvus، والذي يناسب احتياجات المستخدمين بشكل أفضل.</p>
<h3 id="Optimized-load-balancer" class="common-anchor-header">موازن تحميل محسّن</h3><p>تبنّى Milvus 2.3 خوارزمية أكثر مرونة لموازنة التحميل بناءً على الأحمال الحقيقية للنظام. تسمح هذه الخوارزمية المحسّنة للمستخدمين باكتشاف أعطال العُقد والأحمال غير المتوازنة بسرعة وضبط الجداول الزمنية وفقًا لذلك. وفقًا لنتائج اختباراتنا، يمكن لـ Milvus 2.3 اكتشاف الأعطال والأحمال غير المتوازنة وحالة العقدة غير الطبيعية وغيرها من الأحداث في غضون ثوانٍ وإجراء التعديلات على الفور.</p>
<p>لمزيد من المعلومات حول Milvus 2.3، راجع <a href="https://milvus.io/docs/release_notes.md">ملاحظات إصدار Milvus 2.3</a>.</p>
<h2 id="Tool-upgrades" class="common-anchor-header">ترقيات الأداة<button data-href="#Tool-upgrades" class="anchor-icon" translate="no">
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
    </button></h2><p>لقد قمنا أيضًا بترقية Birdwatcher و Attu، وهما أداتان قيّمتان لتشغيل وصيانة Milvus، إلى جانب Milvus 2.3.</p>
<h3 id="Birdwatcher-update" class="common-anchor-header">تحديث مراقب الطيور</h3><p>لقد قمنا بترقية <a href="https://github.com/milvus-io/birdwatcher">Birdwatcher،</a> أداة تصحيح الأخطاء في Milvus، حيث قدمنا العديد من الميزات والتحسينات، بما في ذلك:</p>
<ul>
<li>واجهة برمجة تطبيقات RESTful API للتكامل السلس مع أنظمة التشخيص الأخرى.</li>
<li>دعم أمر PProf لتسهيل التكامل مع أداة Go pprof.</li>
<li>قدرات تحليل استخدام التخزين.</li>
<li>وظيفة تحليل السجل الفعالة.</li>
<li>دعم لعرض التكوينات وتعديلها في etcd.</li>
</ul>
<h3 id="Attu-update" class="common-anchor-header">تحديث أتو</h3><p>لقد أطلقنا واجهة جديدة تمامًا لـ <a href="https://zilliz.com/attu">Attu،</a> وهي أداة إدارة قاعدة بيانات المتجهات المتكاملة. تتميز الواجهة الجديدة بتصميم أكثر وضوحًا وسهولة في الفهم.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Attu_s_new_interface_e24dd0d670.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>لمزيد من التفاصيل، راجع <a href="https://milvus.io/docs/release_notes.md">ملاحظات إصدار Milvus 2.3</a>.</p>
<h2 id="Let’s-keep-in-touch" class="common-anchor-header">لنبقى على اتصال!<button data-href="#Let’s-keep-in-touch" class="anchor-icon" translate="no">
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
    </button></h2><p>إذا كانت لديك أسئلة أو ملاحظات حول Milvus، لا تتردد في الاتصال بنا عبر <a href="https://twitter.com/milvusio">تويتر</a> أو <a href="https://www.linkedin.com/company/the-milvus-project">LinkedIn</a>. نرحب بك أيضًا للانضمام إلى <a href="https://milvus.io/slack/">قناة Slack</a> الخاصة بنا للدردشة مع مهندسينا والمجتمع مباشرةً أو الاطلاع على <a href="https://us02web.zoom.us/meeting/register/tZ0pcO6vrzsuEtVAuGTpNdb6lGnsPBzGfQ1T#/registration">ساعات العمل يوم الثلاثاء</a>!</p>
