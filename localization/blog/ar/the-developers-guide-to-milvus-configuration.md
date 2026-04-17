---
id: the-developers-guide-to-milvus-configuration.md
title: دليل المطور لتكوين ميلفوس
author: Jack Li
date: 2025-04-23T00:00:00.000Z
desc: >-
  قم بتبسيط تكوين Milvus الخاص بك من خلال دليلنا المركّز. اكتشف المعلمات
  الرئيسية لضبطها من أجل تحسين الأداء في تطبيقات قاعدة البيانات المتجهة الخاصة
  بك.
cover: assets.zilliz.com/The_Developer_s_Guide_to_Milvus_Configuration_1519241756.png
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'Milvus, vector database, vector search'
meta_keywords: 'Milvus, configurations, performance, scalability, stability'
meta_title: The Developer’s Guide to Milvus Configuration
origin: 'https://milvus.io/blog/the-developers-guide-to-milvus-configuration.md'
---
<h2 id="Introduction" class="common-anchor-header">مقدمة<button data-href="#Introduction" class="anchor-icon" translate="no">
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
    </button></h2><p>بصفتك مطورًا يعمل مع Milvus، من المحتمل أنك واجهت ملف التكوين <code translate="no">milvus.yaml</code> الشاق مع أكثر من 500 معلمة. قد يكون التعامل مع هذا التعقيد أمرًا صعبًا عندما يكون كل ما تريده هو تحسين أداء قاعدة بيانات المتجهات.</p>
<p>خبر سار: لست بحاجة إلى فهم كل معلمة. يختصر هذا الدليل الضوضاء ويركز على الإعدادات المهمة التي تؤثر بالفعل على الأداء، مع تسليط الضوء على القيم التي يجب تعديلها بالضبط لحالة الاستخدام الخاصة بك.</p>
<p>سواء كنت تنشئ نظام توصية يحتاج إلى استعلامات سريعة أو تحسين تطبيق بحث متجه مع قيود التكلفة، سأوضح لك بالضبط المعلمات التي يجب تعديلها بقيم عملية ومختبرة. بحلول نهاية هذا الدليل، ستعرف كيفية ضبط تكوينات Milvus للحصول على أعلى أداء بناءً على سيناريوهات النشر في العالم الحقيقي.</p>
<h2 id="Configuration-Categories" class="common-anchor-header">فئات التكوين<button data-href="#Configuration-Categories" class="anchor-icon" translate="no">
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
    </button></h2><p>قبل الغوص في معلمات محددة، دعنا نحلل بنية ملف التكوين. عند العمل مع <code translate="no">milvus.yaml</code> ، ستتعامل مع ثلاث فئات من المعلمات:</p>
<ul>
<li><p><strong>تكوينات مكونات التبعية</strong>: الخدمات الخارجية التي يتصل بها ميلفوس (<code translate="no">etcd</code> ، <code translate="no">minio</code> ، <code translate="no">mq</code>) - وهي ضرورية لإعداد الكتلة واستمرار البيانات</p></li>
<li><p><strong>تكوينات المكونات الداخلية</strong>: البنية الداخلية لميلفوس (<code translate="no">proxy</code> ، <code translate="no">queryNode</code> ، الخ) - أساسي لضبط الأداء</p></li>
<li><p><strong>التكوينات الوظيفية</strong>: الأمان، والتسجيل، وحدود الموارد - مهمة لعمليات نشر الإنتاج</p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Milvus_Configurations_f9a7e45dce.PNG" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Milvus-Dependency-Component-Configurations" class="common-anchor-header">تكوينات مكونات التبعية في ميلفوس<button data-href="#Milvus-Dependency-Component-Configurations" class="anchor-icon" translate="no">
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
    </button></h2><p>لنبدأ بالخدمات الخارجية التي يعتمد عليها ميلفوس. هذه التكوينات مهمة بشكل خاص عند الانتقال من التطوير إلى الإنتاج.</p>
<h3 id="etcd-Metadata-Store" class="common-anchor-header"><code translate="no">etcd</code>: مخزن البيانات الوصفية</h3><p>يعتمد ميلفوس على <code translate="no">etcd</code> لاستمرار البيانات الوصفية وتنسيق الخدمة. المعلمات التالية مهمة للغاية:</p>
<ul>
<li><p><code translate="no">Etcd.endpoints</code>: يحدد عنوان مجموعة إلخd. بشكل افتراضي، تقوم Milvus بتشغيل مثيل مجمّع، ولكن في بيئات المؤسسات، من الأفضل الاتصال بخدمة <code translate="no">etcd</code> مُدارة لتحسين التوافر والتحكم التشغيلي.</p></li>
<li><p><code translate="no">etcd.rootPath</code>: يُحدد البادئة الرئيسية لتخزين البيانات المتعلقة بـ Milvus في etcd. إذا كنت تقوم بتشغيل مجموعات Milvus متعددة على نفس الواجهة الخلفية لـ etcd، فإن استخدام مسارات جذر مختلفة يسمح بعزل البيانات الوصفية بشكل نظيف.</p></li>
<li><p><code translate="no">etcd.auth</code>: يتحكم في بيانات اعتماد المصادقة. لا يقوم Milvus بتمكين مصادقة إلخd بشكل افتراضي، ولكن إذا كان مثيل إلخd المُدار يتطلب بيانات اعتماد، فيجب عليك تحديدها هنا.</p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/etcd_in_milvusyaml_dc600c6974.PNG" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="minio-Object-Storage" class="common-anchor-header"><code translate="no">minio</code>: تخزين الكائنات</h3><p>على الرغم من الاسم، فإن هذا القسم يحكم جميع عملاء خدمة تخزين الكائنات المتوافقة مع S3. وهو يدعم موفري خدمات مثل AWS S3 و GCS و Aliyun OSS عبر الإعداد <code translate="no">cloudProvider</code>.</p>
<p>انتبه إلى هذه التكوينات الأربعة الرئيسية:</p>
<ul>
<li><p><code translate="no">minio.address / minio.port</code>: استخدمها لتحديد نقطة نهاية خدمة تخزين الكائنات الخاصة بك.</p></li>
<li><p><code translate="no">minio.bucketName</code>: قم بتعيين دلاء منفصلة (أو بادئات منطقية) لتجنب تصادم البيانات عند تشغيل مجموعات Milvus متعددة.</p></li>
<li><p><code translate="no">minio.rootPath</code>: تمكين تباعد الأسماء داخل الدلو لعزل البيانات.</p></li>
<li><p><code translate="no">minio.cloudProvider</code>: يحدد الواجهة الخلفية ل OSS. للحصول على قائمة توافق كاملة، راجع <a href="https://milvus.io/docs/product_faq.md#Where-does-Milvus-store-data">وثائق Milvus</a>.</p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/minio_in_milvusyaml_faa11c9fcd.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="mq-Message-Queue" class="common-anchor-header"><code translate="no">mq</code>: قائمة انتظار الرسائل</h3><p>يستخدم Milvus قائمة انتظار رسائل لنشر الأحداث الداخلية - إما Pulsar (افتراضي) أو Kafka. انتبه إلى المعلمات الثلاث التالية.</p>
<ol>
<li><p><code translate="no">pulsar.address/pulsar.port</code>: قم بتعيين هذه القيم لاستخدام مجموعة بولسار خارجية.</p></li>
<li><p><code translate="no">pulsar.tenant</code>: يحدد اسم المستأجر. عندما تشترك عدة مجموعات Milvus في مثيل Pulsar، فإن هذا يضمن فصل القنوات النظيفة.</p></li>
<li><p><code translate="no">msgChannel.chanNamePrefix.cluster</code>: إذا كنت تفضل تجاوز نموذج مستأجر Pulsar، اضبط بادئة القناة لمنع التصادم.</p></li>
</ol>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/mq_in_milvusyaml1_2214739c84.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/mq_in_milvusyaml2_a44ff64936.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>يدعم ميلفوس أيضًا كافكا كقائمة انتظار للرسائل. لاستخدام Kafka بدلاً من ذلك، قم بالتعليق على الإعدادات الخاصة بـ Pulsar وإلغاء تعليق كتلة تكوين Kafka.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/mq_in_milvusyaml3_d41f44f77a.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Milvus-Internal-Component-Configurations" class="common-anchor-header">تكوينات مكوّنات ميلفوس الداخلية<button data-href="#Milvus-Internal-Component-Configurations" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="rootCoord-Metadata-+-Timestamps" class="common-anchor-header"><code translate="no">rootCoord</code>: البيانات الوصفية + الطوابع الزمنية</h3><p>تتعامل العقدة <code translate="no">rootCoord</code> مع تغييرات البيانات الوصفية (DDL/DCL) وإدارة الطوابع الزمنية.</p>
<ol>
<li><p><code translate="no">rootCoord.maxPartitionNum</code>： تعيين الحد الأعلى لعدد الأقسام لكل مجموعة. في حين أن الحد الثابت هو 1024، تعمل هذه المعلمة في المقام الأول كحماية. بالنسبة للأنظمة متعددة المستأجرين، تجنب استخدام الأقسام كحدود عزل، وبدلاً من ذلك، قم بتنفيذ إستراتيجية مفتاح المستأجر التي تتسع لملايين المستأجرين المنطقيين.</p></li>
<li><p><code translate="no">rootCoord.enableActiveStandby</code>： تمكين التوافر العالي من خلال تنشيط عقدة احتياطية. هذا أمر بالغ الأهمية لأن عقد منسق ميلفوس لا تتوسع أفقياً بشكل افتراضي.</p></li>
</ol>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/root_Coord_in_milvusyaml_9c2417dbaf.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="proxy-API-Gateway-+-Request-Router" class="common-anchor-header"><code translate="no">proxy</code>: بوابة واجهة برمجة التطبيقات + موجه الطلبات</h3><p>يعالج <code translate="no">proxy</code> الطلبات التي تواجه العميل والتحقق من صحة الطلبات وتجميع النتائج.</p>
<ul>
<li><p><code translate="no">proxy.maxFieldNum</code>: يحد من عدد الحقول (العددية + المتجه) لكل مجموعة. أبقِ هذا العدد أقل من 64 لتقليل تعقيد المخطط وتقليل النفقات العامة للإدخال/الإخراج.</p></li>
<li><p><code translate="no">proxy.maxVectorFieldNum</code>: يتحكم في عدد الحقول المتجهة في المجموعة. يدعم Milvus البحث متعدد الوسائط، ولكن في الممارسة العملية، 10 حقول متجهة هو الحد الأعلى الآمن.</p></li>
<li><p><code translate="no">proxy.maxShardNum</code>: يحدد عدد أجزاء الاستيعاب. كقاعدة عامة</p>
<ul>
<li><p>&lt; 200 مليون سجل ← جزء واحد</p></li>
<li><p>200-400 مليون سجل → 2 شظايا</p></li>
<li><p>التوسع خطيًا بعد ذلك</p></li>
</ul></li>
<li><p><code translate="no">proxy.accesslog</code>: عند التمكين، يؤدي ذلك إلى تسجيل معلومات الطلب التفصيلية (المستخدم، وعنوان IP، ونقطة النهاية، ومجموعة تطوير البرمجيات). مفيد للتدقيق وتصحيح الأخطاء.</p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/proxy_in_milvusyaml_897b33c759.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="queryNode-Query-Execution" class="common-anchor-header"><code translate="no">queryNode</code>: تنفيذ الاستعلام</h3><p>يعالج تنفيذ البحث المتجه وتحميل المقطع. انتبه إلى المعلمة التالية.</p>
<ul>
<li><code translate="no">queryNode.mmap</code>: تبديل الإدخال/الإخراج المعين بالذاكرة لتحميل الحقول والمقاطع القياسية. يساعد تمكين <code translate="no">mmap</code> على تقليل بصمة الذاكرة، ولكنه قد يقلل من زمن الاستجابة إذا أصبح الإدخال/الإخراج من القرص عنق الزجاجة.</li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/query_Node_in_milvusyaml_36e1bf378a.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="dataCoord-Segment-+-Index-Management" class="common-anchor-header"><code translate="no">dataCoord</code>: إدارة الشرائح + الفهرس</h3><p>تتحكم هذه المعلمة في تجزئة البيانات، والفهرسة، والضغط، وجمع البيانات المهملة (GC). تتضمن معلمات التكوين الرئيسية:</p>
<ol>
<li><p><code translate="no">dataCoord.segment.maxSize</code>: تحديد الحد الأقصى لحجم مقطع البيانات في الذاكرة. عادةً ما تعني المقاطع الأكبر حجمًا عددًا أقل من إجمالي المقاطع في النظام، مما يمكن أن يحسن أداء الاستعلام من خلال تقليل الفهرسة ونفقات البحث. على سبيل المثال، أفاد بعض المستخدمين الذين يقومون بتشغيل مثيلات <code translate="no">queryNode</code> مع ذاكرة وصول عشوائي سعتها 128 جيجابايت أن زيادة هذا الإعداد من 1 جيجابايت إلى 8 جيجابايت أدى إلى أداء استعلام أسرع 4 مرات تقريبًا.</p></li>
<li><p><code translate="no">dataCoord.segment.diskSegmentMaxSize</code>: على غرار ما سبق، تتحكم هذه المعلمة في الحد الأقصى لحجم <a href="https://milvus.io/docs/disk_index.md#On-disk-Index">فهارس القرص</a> (فهرس القرصان) على وجه التحديد.</p></li>
<li><p><code translate="no">dataCoord.segment.sealProportion</code>: يحدد متى يتم ختم المقطع المتنامي (أي يتم الانتهاء منه وفهرسته). يتم إغلاق المقطع عندما يصل إلى <code translate="no">maxSize * sealProportion</code>. افتراضيًا، باستخدام <code translate="no">maxSize = 1024MB</code> و <code translate="no">sealProportion = 0.12</code> ، يتم ختم المقطع عند حوالي 123 ميغابايت.</p></li>
</ol>
<ul>
<li><p>تؤدي القيم المنخفضة (على سبيل المثال، 0.12) إلى الختم في وقت أقرب، مما قد يساعد في إنشاء فهرس أسرع - وهو أمر مفيد في أعباء العمل ذات التحديثات المتكررة.</p></li>
<li><p>القيم الأعلى (على سبيل المثال، 0.3 إلى 0.5) تؤخر الختم، مما يقلل من عبء الفهرسة الزائد - وهو أكثر ملاءمة لسيناريوهات الاستيعاب دون اتصال أو الاستيعاب على دفعات.</p></li>
</ul>
<ol start="4">
<li><p><code translate="no">dataCoord.segment.expansionRate</code>:  يضبط عامل التوسيع المسموح به أثناء الضغط. يحسب Milvus الحد الأقصى المسموح به لحجم المقطع المسموح به أثناء الضغط على النحو التالي <code translate="no">maxSize * expansionRate</code>.</p></li>
<li><p><code translate="no">dataCoord.gc.dropTolerance</code>: بعد ضغط مقطع أو إسقاط مجموعة، لا يقوم Milvus بحذف البيانات الأساسية على الفور. وبدلاً من ذلك، فإنه يضع علامة على المقاطع للحذف وينتظر اكتمال دورة تجميع القمامة (GC). تتحكم هذه المعلمة في مدة هذا التأخير.</p></li>
</ol>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/data_Coord_in_milvusyaml1_100d98a081.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/data_Coord_in_milvusyaml2_7fa8c5f2c0.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Other-Functional-Configurations" class="common-anchor-header">تكوينات وظيفية أخرى<button data-href="#Other-Functional-Configurations" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="log-Observability-and-Diagnostics" class="common-anchor-header"><code translate="no">log</code>: إمكانية المراقبة والتشخيص</h3><p>التسجيل القوي هو حجر الزاوية في أي نظام موزع، و Milvus ليس استثناءً. لا يساعد إعداد التسجيل الذي تم تكوينه بشكل جيد في تصحيح الأخطاء عند ظهورها فحسب، بل يضمن أيضًا رؤية أفضل لصحة النظام وسلوكه بمرور الوقت.</p>
<p>بالنسبة لعمليات نشر الإنتاج، نوصي بدمج سجلات Milvus مع أدوات التسجيل والمراقبة المركزية - مثل <a href="https://milvus.io/docs/configure_grafana_loki.md#Deploy-Loki">Loki</a> - لتبسيط التحليل والتنبيه. تتضمن الإعدادات الرئيسية ما يلي:</p>
<ol>
<li><p><code translate="no">log.level</code>: يتحكم في إسهاب إخراج السجل. بالنسبة لبيئات الإنتاج، التزم بالمستوى <code translate="no">info</code> لالتقاط التفاصيل الأساسية لوقت التشغيل دون إرباك النظام. أثناء التطوير أو استكشاف الأخطاء وإصلاحها، يمكنك التبديل إلى <code translate="no">debug</code> للحصول على رؤى أكثر تفصيلاً للعمليات الداخلية. ⚠️ كن حذرًا عند استخدام المستوى <code translate="no">debug</code> في الإنتاج - فهو يولد حجمًا كبيرًا من السجلات، مما قد يستهلك مساحة القرص بسرعة ويقلل من أداء الإدخال/الإخراج إذا لم يتم تحديده.</p></li>
<li><p><code translate="no">log.file</code>: بشكل افتراضي، يكتب Milvus السجلات إلى الإخراج القياسي (stdout)، وهو مناسب للبيئات المعبأة في حاويات حيث يتم جمع السجلات عبر السيارات الجانبية أو وكلاء العقدة. لتمكين التسجيل المستند إلى الملف بدلاً من ذلك، يمكنك تكوين:</p></li>
</ol>
<ul>
<li><p>الحد الأقصى لحجم الملف قبل التدوير</p></li>
<li><p>فترة الاحتفاظ بالملفات</p></li>
<li><p>عدد ملفات السجل الاحتياطية للاحتفاظ بها</p></li>
</ul>
<p>هذا مفيد في البيئات المعدنيّة أو البيئات المحلية حيث لا يتوفر شحن سجلات stdout.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/log_in_milvusyaml_248ead1264.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="security-Authentication-and-Access-Control" class="common-anchor-header"><code translate="no">security</code>: المصادقة والتحكم في الوصول</h3><p>يدعم Milvus <a href="https://milvus.io/docs/authenticate.md?tab=docker">مصادقة المستخدم</a> والتحكم <a href="https://milvus.io/docs/rbac.md">في الوصول المستند إلى الأدوار (RBAC)</a>، وكلاهما يتم تكوينهما ضمن الوحدة النمطية <code translate="no">common</code>. هذه الإعدادات ضرورية لتأمين البيئات متعددة المستأجرين أو أي عملية نشر مكشوفة للعملاء الخارجيين.</p>
<p>تتضمن المعلمات الرئيسية ما يلي:</p>
<ol>
<li><p><code translate="no">common.security.authorizationEnabled</code>: يقوم هذا التبديل بتمكين أو تعطيل المصادقة و RBAC. يتم إيقاف تشغيله افتراضيًا، مما يعني أن جميع العمليات مسموح بها دون التحقق من الهوية. لفرض التحكم الآمن في الوصول، قم بتعيين هذه المعلمة إلى <code translate="no">true</code>.</p></li>
<li><p><code translate="no">common.security.defaultRootPassword</code>: عند تمكين المصادقة، يحدد هذا الإعداد كلمة المرور الأولية للمستخدم المدمج <code translate="no">root</code>.</p></li>
</ol>
<p>تأكد من تغيير كلمة المرور الافتراضية فور تمكين المصادقة لتجنب الثغرات الأمنية في بيئات الإنتاج.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/security_in_milvusyaml_a8d0187b5a.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="quotaAndLimits-Rate-Limiting-and-Write-Control" class="common-anchor-header"><code translate="no">quotaAndLimits</code>: تحديد المعدل والتحكم في الكتابة</h3><p>يلعب قسم <code translate="no">quotaAndLimits</code> في <code translate="no">milvus.yaml</code> دورًا مهمًا في التحكم في كيفية تدفق البيانات عبر النظام. فهو يتحكم في حدود المعدل للعمليات مثل عمليات الإدراج والحذف والمسح والاستعلامات - مما يضمن استقرار المجموعة في ظل أعباء العمل الثقيلة ويمنع تدهور الأداء بسبب تضخيم الكتابة أو الضغط المفرط.</p>
<p>تتضمن المعلمات الرئيسية ما يلي:</p>
<p><code translate="no">quotaAndLimits.flushRate.collection</code>: يتحكم في عدد مرات مسح Milvus للبيانات من المجموعة.</p>
<ul>
<li><p><strong>القيمة الافتراضية</strong>: <code translate="no">0.1</code> ، مما يعني أن النظام يسمح بمسح واحد كل 10 ثوانٍ.</p></li>
<li><p>تقوم عملية المسح بإغلاق مقطع متزايد واستمراره من قائمة انتظار الرسائل إلى مخزن الكائنات.</p></li>
<li><p>يمكن أن يؤدي التدفق المتكرر جدًا إلى توليد العديد من المقاطع الصغيرة المختومة، مما يزيد من عبء الضغط ويضر بأداء الاستعلام.</p></li>
</ul>
<p>💡 أفضل الممارسات: في معظم الحالات، دع ميلفوس يتعامل مع هذا الأمر تلقائيًا. يتم إغلاق المقطع المتزايد بمجرد وصوله إلى <code translate="no">maxSize * sealProportion</code> ، ويتم مسح المقاطع المغلقة كل 10 دقائق. يوصى بعمليات المسح اليدوي فقط بعد الإدخالات المجمعة عندما تعلم أنه لا يوجد المزيد من البيانات القادمة.</p>
<p>ضع في اعتبارك أيضًا: يتم تحديد <strong>رؤية البيانات</strong> من خلال <em>مستوى اتساق</em> الاستعلام، وليس توقيت التدفق - لذا فإن التدفق لا يجعل البيانات الجديدة قابلة للاستعلام عنها على الفور.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/quota_And_Limits1_be185e571f.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><code translate="no">quotaAndLimits.upsertRate</code>/<code translate="no">quotaAndLimits.deleteRate</code>: تحدد هذه المعلمات الحد الأقصى للمعدل المسموح به لعمليات الإدراج والحذف.</p>
<ul>
<li><p>يعتمد Milvus على بنية تخزين LSM-Tree، مما يعني أن التحديثات وعمليات الحذف المتكررة تؤدي إلى الضغط. قد يستهلك هذا الأمر الكثير من الموارد ويقلل من الإنتاجية الإجمالية إذا لم تتم إدارته بعناية.</p></li>
<li><p>يوصى بوضع حد أقصى لكل من <code translate="no">upsertRate</code> و <code translate="no">deleteRate</code> عند <strong>0.5 ميغابايت/ثانية</strong> لتجنب إرباك خط أنابيب الضغط.</p></li>
</ul>
<p>🚀 هل تحتاج إلى تحديث مجموعة بيانات كبيرة بسرعة؟ استخدم استراتيجية الاسم المستعار للمجموعة:</p>
<ul>
<li><p>أدخل بيانات جديدة في مجموعة جديدة.</p></li>
<li><p>بمجرد اكتمال التحديث، أعد تعيين الاسم المستعار إلى المجموعة الجديدة. يتجنب ذلك عقوبة الضغط للتحديثات الموضعية ويسمح بالتبديل الفوري.</p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/quota_And_Limits2_32c8640190.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Real-World-Configuration-Examples" class="common-anchor-header">أمثلة على التكوين الواقعي<button data-href="#Real-World-Configuration-Examples" class="anchor-icon" translate="no">
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
    </button></h2><p>دعونا نستعرض سيناريوهين شائعين للنشر لتوضيح كيف يمكن ضبط إعدادات تكوين Milvus لتتناسب مع الأهداف التشغيلية المختلفة.</p>
<h3 id="⚡-Example-1-High-Performance-Configuration" class="common-anchor-header">⚡ مثال 1: تكوين عالي الأداء</h3><p>عندما يكون وقت استجابة الاستعلام أمرًا بالغ الأهمية للمهمة - فكر في محركات التوصيات أو منصات البحث الدلالي أو تسجيل المخاطر في الوقت الفعلي - فكل جزء من الثانية مهم. في حالات الاستخدام هذه، ستعتمد عادةً على الفهارس المستندة إلى الرسم البياني مثل <strong>HNSW</strong> أو <strong>DISKANN،</strong> وستعمل على تحسين استخدام الذاكرة وسلوك دورة حياة المقطع.</p>
<p>استراتيجيات الضبط الرئيسية:</p>
<ul>
<li><p>قم بزيادة <code translate="no">dataCoord.segment.maxSize</code> و <code translate="no">dataCoord.segment.diskSegmentMaxSize</code>: ارفع هذه القيم إلى 4 جيجابايت أو حتى 8 جيجابايت، اعتمادًا على ذاكرة الوصول العشوائي المتاحة. تعمل المقاطع الأكبر على تقليل عدد عمليات إنشاء الفهرس وتحسين إنتاجية الاستعلام من خلال تقليل انتشار المقطع. ومع ذلك، تستهلك المقاطع الأكبر حجمًا ذاكرة أكبر في وقت الاستعلام - لذا تأكد من أن مثيلات <code translate="no">indexNode</code> و <code translate="no">queryNode</code> لديها مساحة كافية.</p></li>
<li><p>أقل <code translate="no">dataCoord.segment.sealProportion</code> و <code translate="no">dataCoord.segment.expansionRate</code>: استهدف حجم مقطع متزايد يبلغ حوالي 200 ميغابايت قبل الختم. هذا يحافظ على إمكانية التنبؤ باستخدام ذاكرة المقطع ويقلل من العبء على المفوض (قائد عقدة الاستعلام الذي ينسق البحث الموزع).</p></li>
</ul>
<p>قاعدة عامة: فضّل المقاطع الأقل حجماً والأكبر حجماً عندما تكون الذاكرة وفيرة ووقت الاستجابة أولوية. كن متحفظًا مع عتبات الختم إذا كان تحديث الفهرس مهمًا.</p>
<h3 id="💰-Example-2-Cost-Optimized-Configuration" class="common-anchor-header">💰 مثال 2: التكوين الأمثل من حيث التكلفة</h3><p>إذا كنت تعطي الأولوية لفعالية التكلفة على الأداء الخام - وهو أمر شائع في خطوط أنابيب تدريب النماذج، أو الأدوات الداخلية ذات معدل الاستجابة المنخفض في الثانية أو البحث عن الصور ذات الذيل الطويل - يمكنك المفاضلة بين الاسترجاع أو زمن الوصول لتقليل متطلبات البنية التحتية بشكل كبير.</p>
<p>الاستراتيجيات الموصى بها:</p>
<ul>
<li><p><strong>استخدم تكميم الفهرس:</strong> تقلل أنواع الفهارس مثل <code translate="no">SCANN</code> أو <code translate="no">IVF_SQ8</code> أو <code translate="no">HNSW_PQ/PRQ/SQ</code> (التي تم تقديمها في Milvus 2.5) بشكل كبير من حجم الفهرس وبصمة الذاكرة. وهي مثالية لأعباء العمل حيث تكون الدقة أقل أهمية من الحجم أو الميزانية.</p></li>
<li><p><strong>اعتماد استراتيجية فهرسة مدعومة بالقرص:</strong> قم بتعيين نوع الفهرس على <code translate="no">DISKANN</code> لتمكين البحث المستند إلى القرص فقط. <strong>تمكين</strong> <code translate="no">mmap</code> لإلغاء تحميل الذاكرة الانتقائي.</p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/query_Node_in_milvusyaml_36e1bf378a.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>للتوفير الشديد في الذاكرة، قم بتمكين <code translate="no">mmap</code> لما يلي: <code translate="no">vectorField</code> <code translate="no">vectorIndex</code> و <code translate="no">scalarField</code> و و <code translate="no">scalarIndex</code>. يؤدي هذا إلى إلغاء تحميل أجزاء كبيرة من البيانات إلى الذاكرة الظاهرية، مما يقلل من استخدام ذاكرة الوصول العشوائي المقيمة بشكل كبير.</p>
<p>⚠️ تنبيه: إذا كانت التصفية العددية جزءًا رئيسيًا من عبء عمل الاستعلام الخاص بك، ففكر في تعطيل <code translate="no">mmap</code> لـ <code translate="no">vectorIndex</code> و <code translate="no">scalarIndex</code>. يمكن لتعيين الذاكرة أن يقلل من أداء الاستعلام القياسي في البيئات المقيدة بالإدخال/الإخراج.</p>
<h4 id="Disk-usage-tip" class="common-anchor-header">نصيحة استخدام القرص</h4><ul>
<li><p>يمكن لفهارس HNSW التي تم إنشاؤها باستخدام <code translate="no">mmap</code> توسيع حجم البيانات الإجمالي بما يصل إلى <strong>1.8×</strong>.</p></li>
<li><p>قد يستوعب قرص فعلي بسعة 100 جيجابايت فقط حوالي 50 جيجابايت من البيانات الفعالة من الناحية الواقعية عند حساب النفقات العامة للفهرس والتخزين المؤقت.</p></li>
<li><p>قم دائمًا بتوفير مساحة تخزين إضافية عند العمل مع <code translate="no">mmap</code> ، خاصةً إذا كنت تقوم أيضًا بتخزين المتجهات الأصلية مؤقتًا محليًا.</p></li>
</ul>
<h2 id="Conclusion" class="common-anchor-header">الخلاصة<button data-href="#Conclusion" class="anchor-icon" translate="no">
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
    </button></h2><p>لا يتعلق ضبط Milvus بمطاردة الأرقام المثالية - بل يتعلق بتشكيل النظام حول سلوك عبء العمل في العالم الحقيقي. غالبًا ما تأتي التحسينات الأكثر تأثيرًا من فهم كيفية تعامل ميلفوس مع الإدخال/الإخراج، ودورة حياة المقطع، والفهرسة تحت الضغط. هذه هي المسارات التي يكون فيها سوء التهيئة هو الأكثر ضررًا - وحيث يحقق الضبط المدروس أكبر العوائد.</p>
<p>إذا كنت جديدًا على Milvus، فإن معلمات التكوين التي قمنا بتغطيتها ستغطي 80-90% من احتياجاتك من الأداء والاستقرار. ابدأ من هناك. بمجرد الانتهاء من بناء بعض الحدس، تعمق أكثر في مواصفات <code translate="no">milvus.yaml</code> الكاملة والوثائق الرسمية - ستكتشف عناصر تحكم دقيقة يمكن أن تنقل عملية النشر من وظيفية إلى استثنائية.</p>
<p>مع وجود التكوينات الصحيحة في مكانها الصحيح، ستكون جاهزًا لبناء أنظمة بحث متجهية قابلة للتطوير وعالية الأداء تتوافق مع أولوياتك التشغيلية - سواء كان ذلك يعني خدمة منخفضة الكمون أو تخزينًا فعالاً من حيث التكلفة أو أعباء عمل تحليلية عالية الأداء.</p>
