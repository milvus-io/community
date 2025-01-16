---
id: scheduling-query-tasks-milvus.md
title: الخلفية
author: milvus
date: 2020-03-03T22:38:17.829Z
desc: العمل خلف الكواليس
cover: assets.zilliz.com/eric_rothermel_Fo_KO_4_Dp_Xam_Q_unsplash_469fe12aeb.jpg
tag: Engineering
canonicalUrl: 'https://zilliz.com/blog/scheduling-query-tasks-milvus'
---
<custom-h1>كيف يقوم ميلفوس بجدولة مهام الاستعلام</custom-h1><p>في هذه المقالة، سنناقش كيفية جدولة ميلفوس لمهام الاستعلام. سنتحدث أيضًا عن المشاكل والحلول والتوجهات المستقبلية لتنفيذ جدولة ميلفوس.</p>
<h2 id="Background" class="common-anchor-header">الخلفية<button data-href="#Background" class="anchor-icon" translate="no">
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
    </button></h2><p>نحن نعلم من إدارة البيانات في محرك البحث المتجه الضخم النطاق أن البحث عن التشابه المتجه يتم تنفيذه من خلال المسافة بين متجهين في الفضاء عالي الأبعاد. الهدف من البحث عن المتجهات هو إيجاد المتجهات K الأقرب إلى المتجه الهدف.</p>
<p>هناك العديد من الطرق لقياس المسافة بين المتجهات، مثل المسافة الإقليدية:</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1_euclidean_distance_156037c939.png" alt="1-euclidean-distance.png" class="doc-image" id="1-euclidean-distance.png" />
   </span> <span class="img-wrapper"> <span>1-euclidean-distance.png</span> </span></p>
<p>حيث x و y متجهان. n هو بُعد المتجهات.</p>
<p>للعثور على أقرب متجهات K في مجموعة البيانات، يجب حساب المسافة الإقليدية بين المتجه الهدف وجميع المتجهات في مجموعة البيانات المراد البحث عنها. بعد ذلك، يتم فرز المتجهات حسب المسافة للحصول على أقرب K من المتجهات. يتناسب العمل الحسابي تناسبًا طرديًا مع حجم مجموعة البيانات. كلما زاد حجم مجموعة البيانات، زاد العمل الحسابي الذي يتطلبه الاستعلام. تصادف أن وحدة معالجة الرسوم البيانية (GPU) المتخصصة في معالجة الرسوم البيانية تحتوي على الكثير من النوى لتوفير القدرة الحاسوبية المطلوبة. وبالتالي، يتم أيضًا أخذ دعم وحدات معالجة الرسومات المتعددة في الاعتبار أثناء تنفيذ Milvus.</p>
<h2 id="Basic-concepts" class="common-anchor-header">المفاهيم الأساسية<button data-href="#Basic-concepts" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Data-blockTableFile" class="common-anchor-header">كتلة البيانات （ملف الجدول）</h3><p>لتحسين دعم البحث عن البيانات على نطاق واسع، قمنا بتحسين تخزين البيانات في Milvus. يقسم Milvus البيانات في جدول حسب الحجم إلى كتل بيانات متعددة. أثناء البحث المتجه، يبحث Milvus في المتجهات في كل كتلة بيانات ويدمج النتائج. تتكون عملية بحث متجه واحدة من عمليات بحث متجهية مستقلة N (N هو عدد كتل البيانات) وعمليات دمج النتائج N-1.</p>
<h3 id="Task-queueTaskTable" class="common-anchor-header">قائمة انتظار المهام (جدول المهام)</h3><p>يحتوي كل مورد على مصفوفة مهام، والتي تسجل المهام التي تنتمي إلى المورد. لكل مهمة حالات مختلفة، بما في ذلك البدء والتحميل والتحميل والتحميل والتنفيذ والتنفيذ. يشترك المحمل والمنفذ في جهاز الحوسبة في نفس قائمة انتظار المهام.</p>
<h3 id="Query-scheduling" class="common-anchor-header">جدولة الاستعلام</h3><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/2_query_scheduling_5798178be2.png" alt="2-query-scheduling.png" class="doc-image" id="2-query-scheduling.png" />
   </span> <span class="img-wrapper"> <span>2-جدولة الاستعلام.png</span> </span></p>
<ol>
<li>عند بدء تشغيل خادم Milvus، يقوم Milvus بتشغيل GpuResource المقابل عبر المعلمات <code translate="no">gpu_resource_config</code> في ملف التكوين <code translate="no">server_config.yaml</code>. لا يزال يتعذر تحرير DiskResource و CpuResource في <code translate="no">server_config.yaml</code>. GpuResource هو مزيج من <code translate="no">search_resources</code> و <code translate="no">build_index_resources</code> ويشار إليه باسم <code translate="no">{gpu0, gpu1}</code> في المثال التالي:</li>
</ol>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/3_sample_code_ffee1c290f.png" alt="3-sample-code.png" class="doc-image" id="3-sample-code.png" />
   </span> <span class="img-wrapper"> <span>3-مثال الرمز.png</span> </span></p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/3_example_0eeb85da71.png" alt="3-example.png" class="doc-image" id="3-example.png" />
   </span> <span class="img-wrapper"> <span>3-مثال.png</span> </span></p>
<ol start="2">
<li>يتلقى ميلفوس طلبًا. يتم تخزين البيانات الوصفية للجدول في قاعدة بيانات خارجية، وهي SQLite أو MySQl للمضيف الواحد و MySQL للموزع. بعد تلقي طلب البحث، يقوم Milvus بالتحقق من صحة ما إذا كان الجدول موجوداً والبُعد متناسقاً. بعد ذلك، يقوم Milvus بقراءة قائمة TableFile للجدول.</li>
</ol>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/4_milvus_reads_tablefile_list_1e9d851543.png" alt="4-milvus-reads-tablefile-list.png" class="doc-image" id="4-milvus-reads-tablefile-list.png" />
   </span> <span class="img-wrapper"> <span>4-ميلفوس-قراءة-قائمة-ملف-جدول-قائمة-ملف-ملف.png</span> </span></p>
<ol start="3">
<li>ينشئ ميلفوس مهمة بحث. نظرًا لأن حساب كل TableFile يتم إجراؤه بشكل مستقل، يقوم Milvus بإنشاء مهمة بحث لكل TableFile. كوحدة أساسية لجدولة المهام، يحتوي SearchTask على المتجهات المستهدفة ومعلمات البحث وأسماء ملفات TableFile.</li>
</ol>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/5_table_file_list_task_creator_36262593e4.png" alt="5-table-file-list-task-creator.png" class="doc-image" id="5-table-file-list-task-creator.png" />
   </span> <span class="img-wrapper"> <span>5-جدول-ملف-قائمة-ملف-مهمة-منشئ-ملف-بنج</span> </span></p>
<ol start="4">
<li>يختار ميلفوس جهاز حوسبة. يعتمد الجهاز الذي ينفذ فيه SearchTask عملية الحوسبة على وقت <strong>الإكمال المقدر</strong> لكل جهاز. ويحدد وقت <strong>الإكمال</strong> المقدر الفاصل الزمني المقدر بين الوقت الحالي والوقت المقدر لاكتمال الحساب.</li>
</ol>
<p>على سبيل المثال، عندما يتم تحميل كتلة بيانات لمهمة بحث إلى ذاكرة وحدة المعالجة المركزية، تكون مهمة البحث التالية في انتظار قائمة انتظار مهام حساب وحدة المعالجة المركزية وتكون قائمة انتظار مهام حساب وحدة معالجة الرسومات خاملة. يساوي وقت <strong>الإكمال</strong> المقدر لوحدة المعالجة المركزية مجموع التكلفة الزمنية المقدرة لمهمة البحث السابقة ومهمة البحث الحالية. يساوي <strong>وقت الإكمال المقدر</strong> لوحدة معالجة الرسومات مجموع الوقت اللازم لتحميل كتل البيانات إلى وحدة معالجة الرسومات والتكلفة الزمنية المقدرة لمهمة البحث الحالية SearchTask. يساوي <strong>وقت</strong> الإكمال <strong>المقدر</strong> لمهمة بحث في مورد ما متوسط وقت التنفيذ لجميع مهام البحث في المورد. يختار Milvus بعد ذلك جهازًا بأقل <strong>وقت إكمال تقديري</strong> ويخصص مهمة البحث إلى الجهاز.</p>
<p>نفترض هنا أن <strong>وقت</strong> الإكمال المقدر لوحدة معالجة الرسومات1 أقصر.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/6_GPU_1_shorter_estimated_completion_time_42c7639b87.png" alt="6-GPU1-shorter-estimated-completion-time.png" class="doc-image" id="6-gpu1-shorter-estimated-completion-time.png" />
   </span> <span class="img-wrapper"> <span>6-وحدة معالجة الرسوميات1-وقت الإكمال المقدر-الأقصر.png</span> </span></p>
<ol start="5">
<li><p>يضيف Milvus مهمة البحث SearchTask إلى قائمة انتظار المهام في DiskResource.</p></li>
<li><p>ينقل Milvus مهمة البحث إلى قائمة انتظار المهام في CpuResource. يقوم مؤشر ترابط التحميل في CpuResource بتحميل كل مهمة من قائمة انتظار المهام بالتتابع. يقوم CpuResource بقراءة كتل البيانات المقابلة إلى ذاكرة وحدة المعالجة المركزية.</p></li>
<li><p>ينقل Milvus SearchTask إلى GpuResource. يقوم مؤشر ترابط التحميل في GpuResource بنسخ البيانات من ذاكرة وحدة المعالجة المركزية إلى ذاكرة وحدة معالجة الرسومات. يقوم GpuResource بقراءة كتل البيانات المقابلة إلى ذاكرة وحدة معالجة الرسومات.</p></li>
<li><p>يقوم Milvus بتنفيذ SearchTask في GpuResource. نظرًا لأن نتيجة SearchTask صغيرة نسبيًا، يتم إرجاع النتيجة مباشرةً إلى ذاكرة وحدة المعالجة المركزية.</p></li>
</ol>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/7_scheduler_53f1fbbaba.png" alt="7-scheduler.png" class="doc-image" id="7-scheduler.png" />
   </span> <span class="img-wrapper"> <span>7-Scheduler.png</span> </span></p>
<ol start="9">
<li>يدمج Milvus نتيجة SearchTask في نتيجة البحث بأكملها.</li>
</ol>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/8_milvus_merges_searchtast_result_9f3446e65a.png" alt="8-milvus-merges-searchtast-result.png" class="doc-image" id="8-milvus-merges-searchtast-result.png" />
   </span> <span class="img-wrapper"> <span>8-ملفوس-يدمج-يدمج-نتيجة-مهمة-بحث-نتيجة-بحث.png</span> </span></p>
<p>بعد اكتمال جميع مهام البحث، يقوم ميلفوس بإرجاع نتيجة البحث كاملة إلى العميل.</p>
<h2 id="Index-building" class="common-anchor-header">بناء الفهرس<button data-href="#Index-building" class="anchor-icon" translate="no">
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
    </button></h2><p>بناء الفهرس هو في الأساس نفس عملية البحث بدون عملية الدمج. لن نتحدث عن هذا بالتفصيل.</p>
<h2 id="Performance-optimization" class="common-anchor-header">تحسين الأداء<button data-href="#Performance-optimization" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Cache" class="common-anchor-header">التخزين المؤقت</h3><p>كما ذكرنا من قبل، يجب تحميل كتل البيانات إلى أجهزة التخزين المقابلة مثل ذاكرة وحدة المعالجة المركزية أو ذاكرة وحدة معالجة الرسومات قبل إجراء الحساب. لتجنب التحميل المتكرر للبيانات، يقدم Milvus ذاكرة التخزين المؤقت LRU (الأقل استخدامًا مؤخرًا). عندما تمتلئ ذاكرة التخزين المؤقت، تقوم كتل البيانات الجديدة بإبعاد كتل البيانات القديمة. يمكنك تخصيص حجم ذاكرة التخزين المؤقت بواسطة ملف التكوين بناءً على حجم الذاكرة الحالي. يوصى باستخدام ذاكرة تخزين مؤقت كبيرة لتخزين بيانات البحث لتوفير وقت تحميل البيانات بفعالية وتحسين أداء البحث.</p>
<h3 id="Data-loading-and-computation-overlap" class="common-anchor-header">تداخل تحميل البيانات والحساب</h3><p>لا يمكن لذاكرة التخزين المؤقت تلبية احتياجاتنا لتحسين أداء البحث. يجب إعادة تحميل البيانات عندما تكون الذاكرة غير كافية أو عندما يكون حجم مجموعة البيانات كبيرًا جدًا. نحتاج إلى تقليل تأثير تحميل البيانات على أداء البحث. ينتمي تحميل البيانات، سواءً كان من القرص إلى ذاكرة وحدة المعالجة المركزية أو من ذاكرة وحدة المعالجة المركزية إلى ذاكرة وحدة معالجة الرسومات، إلى عمليات الإدخال والإخراج وبالكاد يحتاج إلى أي عمل حسابي من المعالجات. لذا، نأخذ بعين الاعتبار إجراء تحميل البيانات والحساب بالتوازي من أجل استخدام أفضل للموارد.</p>
<p>نقوم بتقسيم الحوسبة على كتلة بيانات إلى 3 مراحل (التحميل من القرص إلى ذاكرة وحدة المعالجة المركزية، وحساب وحدة المعالجة المركزية، ودمج النتائج) أو 4 مراحل (التحميل من القرص إلى ذاكرة وحدة المعالجة المركزية، والتحميل من ذاكرة وحدة المعالجة المركزية إلى ذاكرة وحدة معالجة الرسومات، وحساب وحدة معالجة الرسومات، واسترجاع النتائج، ودمج النتائج). لنأخذ الحوسبة على 3 مراحل كمثال، يمكننا إطلاق 3 خيوط مسؤولة عن المراحل الثلاث لتعمل على شكل أنابيب تعليمات. نظرًا لأن مجموعات النتائج صغيرة في الغالب، فإن دمج النتائج لا يستغرق الكثير من الوقت. في بعض الحالات، يمكن أن يؤدي تداخل تحميل البيانات والحساب إلى تقليل وقت البحث بمقدار 1/2.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/9_sequential_overlapping_load_milvus_1af809b29e.png" alt="9-sequential-overlapping-load-milvus.png" class="doc-image" id="9-sequential-overlapping-load-milvus.png" />
   </span> <span class="img-wrapper"> <span>9-التحميل المتسلسل-التداخل-التحميل-ملفوس.png</span> </span></p>
<h2 id="Problems-and-solutions" class="common-anchor-header">المشاكل والحلول<button data-href="#Problems-and-solutions" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Different-transmission-speeds" class="common-anchor-header">سرعات نقل مختلفة</h3><p>في السابق، كان Milvus يستخدم استراتيجية Round Robin لجدولة المهام متعددة وحدات معالجة الرسومات. عملت هذه الاستراتيجية بشكل مثالي في خادمنا المكون من 4 وحدات معالجة GPU وكان أداء البحث أفضل 4 مرات. ومع ذلك، لم يكن الأداء أفضل بمرتين بالنسبة لمضيفي وحدة معالجة الجاذبية الثنائية لدينا. لقد أجرينا بعض التجارب واكتشفنا أن سرعة نسخ البيانات لوحدة معالجة الرسومات كانت 11 جيجابايت/ثانية. ومع ذلك، بالنسبة لوحدة معالجة رسومات أخرى، كانت 3 جيجابايت/ثانية. بعد الرجوع إلى وثائق اللوحة الرئيسية، تأكدنا من أن اللوحة الرئيسية كانت متصلة بوحدة معالجة رسومات واحدة عبر PCIe x16 ووحدة معالجة رسومات أخرى عبر PCIe x4. وهذا يعني أن وحدات معالجة الرسومات هذه لها سرعات نسخ مختلفة. في وقت لاحق، أضفنا وقت النسخ لقياس الجهاز الأمثل لكل مهمة بحث.</p>
<h2 id="Future-work" class="common-anchor-header">العمل المستقبلي<button data-href="#Future-work" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Hardware-environment-with-increased-complexity" class="common-anchor-header">بيئة الأجهزة مع زيادة التعقيد</h3><p>في الظروف الحقيقية، قد تكون بيئة الأجهزة أكثر تعقيدًا. بالنسبة لبيئات الأجهزة التي تحتوي على وحدات معالجة مركزية متعددة، وذاكرة ذات بنية NUMA، و NVLink، و NVSwitch، فإن الاتصال عبر وحدات المعالجة المركزية/وحدات معالجة الرسومات يجلب الكثير من الفرص للتحسين.</p>
<p>تحسين الاستعلام</p>
<p>أثناء التجربة، اكتشفنا بعض الفرص لتحسين الأداء. على سبيل المثال، عندما يتلقى الخادم استعلامات متعددة لنفس الجدول، يمكن دمج الاستعلامات في ظل بعض الظروف. باستخدام محلية البيانات، يمكننا تحسين الأداء. سيتم تنفيذ هذه التحسينات في تطويرنا المستقبلي. الآن نحن نعرف بالفعل كيف تتم جدولة الاستعلامات وتنفيذها لسيناريو المضيف الواحد، وحدة معالجة رسومات متعددة. سنواصل تقديم المزيد من الآليات الداخلية لـ Milvus في المقالات القادمة.</p>
